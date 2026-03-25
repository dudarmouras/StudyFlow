"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
const DTOs_1 = require("../DTOs");
class TasksController {
    async create(req, res, next) {
        try {
            const userId = req.user?.id;
            const tasksData = DTOs_1.Tasks.safeParse({
                ...req.body,
                userId,
            });
            ;
            if (!tasksData.success) {
                const error = tasksData.error.issues.map((err) => err.message);
                res.status(400).json({
                    message: error[0]
                });
                return;
            }
            const task = await repository_1.TasksRepository.create(tasksData.data);
            res.status(201).json({
                message: 'Task created',
                data: task,
            });
            ;
        }
        catch (error) {
            return next(error);
        }
    }
    async update(req, res, next) {
        try {
            const tasksId = req.params.id;
            const userId = req.user?.id;
            const tasksData = DTOs_1.UpdateTasks.safeParse(req.body);
            if (!tasksData.success) {
                const error = tasksData.error.issues.map((err) => err.message);
                res.status(400).json({
                    message: error[0]
                });
                return;
            }
            const existingTask = await repository_1.TasksRepository.findById(tasksId);
            if (!existingTask) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            // Verifies if the Task belong to the User
            if (existingTask.userId !== userId) {
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
            const task = await repository_1.TasksRepository.update(tasksId, tasksData.data);
            res.status(200).json({
                message: 'Task updated',
                data: task
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const tasksId = req.params.id;
            const userId = req.user?.id;
            const existingTask = await repository_1.TasksRepository.findById(tasksId);
            if (!existingTask) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            // Verifies the Task will by deleted by their own User
            if (existingTask.userId !== userId) {
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
            const task = await repository_1.TasksRepository.delete(tasksId);
            if (!task) {
                res.status(404).json({
                    message: 'Task not found'
                });
                return;
            }
            res.status(200).json({
                message: 'Task deleted'
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async readByUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const tasks = await repository_1.TasksRepository.findByUser(userId);
            res.status(200).json({ data: tasks });
        }
        catch (error) {
            return next(error);
        }
    }
    async readByRoomId(req, res, next) {
        try {
            const roomId = req.params.roomId;
            const tasks = await repository_1.TasksRepository.findByRoom(roomId);
            res.status(200).json({ data: tasks });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.default = new TasksController();
