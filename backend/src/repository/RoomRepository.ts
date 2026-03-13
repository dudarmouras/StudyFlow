import { z } from 'zod';
import prisma from '../database';
import { randomBytes } from 'crypto';
import { CreateRoom,  UpdateRoom } from '../DTOs';

class RoomRepository {
    
    private generateCode(): string {
        return randomBytes(3).toString('hex').toUpperCase(); // ex: A3F9B2
    }

    async create(data: z.infer<typeof CreateRoom>) {
        const room = await prisma.room.create({ data:{
            code: this.generateCode(),
            password: data.password,
            roomName: data.roomName
            }
         });
        return room;
    }

    async update(id:string, data: z.infer<typeof UpdateRoom>){
        const room = await prisma.room.update({where: { id }, data});
        return room;
    }
    
    async findById(id:string){
        const room = await prisma.room.findUnique({where: { id }});
        return room;
    }

    async findByCode(code:string){
        const room = await prisma.room.findUnique({where: { code }});
        return room;
    }

    async findAll(){
        const rooms = await prisma.room.findMany();
        return rooms;
    }

    async delete(id:string){
        const room = await prisma.room.delete({where: { id }});
        return room;
    }
}

export default new RoomRepository();