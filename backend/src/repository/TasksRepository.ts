import { z } from 'zod';
import prisma from '../database';
import { Tasks,  UpdateTasks } from '../DTOs';

class TasksRepository{
    
    async create(data: z.infer<typeof Tasks>) {
        const task = await prisma.tasks.create({ data });
        return task;
    }
    
    async update(id:string, data: z.infer<typeof UpdateTasks>) {
        const task = await prisma.tasks.update({where: { id }, data });
        return task;
    }

    async findByUser(userId: string){
        const tasks = await prisma.tasks.findMany({where: {userId}})
        return tasks;
    }

    async findByRoom(roomId: string){
        const tasks = await prisma.tasks.findMany({where: {roomId}});
        return tasks;
    }

    async delete(id:string){
        const task = await prisma.tasks.delete({where: { id }});
        return task;
    }
}

export default new TasksRepository();