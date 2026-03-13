import { TasksRepository , UserRepository} from "../repository";
import { Request, Response, NextFunction } from 'express';
import { Tasks, UpdateTasks } from '../DTOs'

class TasksController{

    async create(req: Request, res: Response, next: NextFunction){
        try{
            const tasksData = Tasks.safeParse(req.body);

            if(!tasksData.success){
                const error = tasksData.error.issues.map((err) => err.message);

                res.status(400).json({
                    message: error[0]
                     });
                
                return;
            }

            const task = await TasksRepository.create( tasksData.data );

            res.status(201).json({ 
                message: 'Task created', 
                data: task ,
            });;

        }
        catch(error){
            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction){
        try{
            const tasksId = req.params.id as string;
            const userId = req.user?.id as string;
            const tasksData = UpdateTasks.safeParse(req.body)

            if(!tasksData.success){
                const error = tasksData.error.issues.map((err) => err.message);

                res.status(400).json({
                    message: error[0]
                     });
                
                return;
            }

             const existingTask = await TasksRepository.findById(tasksId);

            if(!existingTask){
                res.status(404).json({ message: 'Task not found' });
                return;
            }

            // Verifies if the Task belong to the User
            if(existingTask.userId !== userId){
                res.status(403).json({ message: 'Not authorized' });
                return;
            }

            const task = await TasksRepository.update(tasksId , tasksData.data) 
                res.status(200).json({ 
                    message: 'Task updated', 
                    data: task 
                });
        }
        catch(error){
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction){
        try{
            const tasksId = req.params.id as string;
            const userId = req.user?.id as string;
            const existingTask = await TasksRepository.findById(tasksId);

            if(!existingTask){
                res.status(404).json({ message: 'Task not found' });
                return;
            }

            // Verifies the Task will by deleted by their own User
            if(existingTask.userId !== userId){
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
            const task = await TasksRepository.delete( tasksId );

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
        catch(error){
            return next(error);
        }
    }

    async readByUser(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.userId as string;
            const tasks = TasksRepository.findByUser(userId);

            res.status(200).json({ data: tasks });
        }
        catch(error){
            return next(error);
        }
    }

    async readByRoomId(req: Request, res: Response, next: NextFunction){
        try{
            const roomId = req.params.roomId as string;
            const tasks = TasksRepository.findByRoom(roomId);

            res.status(200).json({ data: tasks });
        }
        catch(error){
            return next(error);
        }
    }
}

export default new TasksController();