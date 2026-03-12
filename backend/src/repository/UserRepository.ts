import { z } from 'zod';
import prisma from '../database';
import { User, UpdateUser } from '../DTOs';

// Creating the most used operations for User as create, update, delete, findbyid (get) and findbyemail(get)
class UserRepository {
    async create(data: z.infer<typeof User>) {
        const user = await prisma.user.create({ data });
        return user;
    }

    async update(id:string, data: z.infer<typeof UpdateUser>){
        const user = await prisma.user.update({where: { id }, data});
        return user;
    }
    
    async findById(id:string){
        const user = await prisma.user.findUnique({where: { id }});
        return user;
    }

    async findByEmail(email: string){
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    }

    async delete(id:string){
        const user = await prisma.user.delete({where: { id }});
        return user;
    }
}

export default new UserRepository();