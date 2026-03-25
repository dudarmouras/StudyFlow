"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class TasksRepository {
    async create(data) {
        const task = await database_1.default.tasks.create({ data });
        return task;
    }
    async update(id, data) {
        const task = await database_1.default.tasks.update({ where: { id }, data });
        return task;
    }
    async findByUser(userId) {
        const tasks = await database_1.default.tasks.findMany({ where: { userId } });
        return tasks;
    }
    async findByRoom(roomId) {
        const tasks = await database_1.default.tasks.findMany({ where: { roomId } });
        return tasks;
    }
    async delete(id) {
        const task = await database_1.default.tasks.delete({ where: { id } });
        return task;
    }
    async findById(id) {
        const task = await database_1.default.tasks.findUnique({ where: { id } });
        return task;
    }
}
exports.default = new TasksRepository();
