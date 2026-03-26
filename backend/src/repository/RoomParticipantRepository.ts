import { z } from 'zod';
import prisma from '../database';
import { CreateRoomParticipant } from '../DTOs';

class RoomParticipantRepository {

    async create(data: z.infer<typeof CreateRoomParticipant>) {
        return prisma.roomParticipant.create({ data });
    }

    async findByRoom(roomId: string) {
        return prisma.roomParticipant.findMany({
            where: { roomId },
            include: {
                user: { select: { id: true, name: true } }
            }
        });
    }

    async findByUser(userId: string) {
        return prisma.roomParticipant.findMany({
            where: { userId },
            include: {
                room: { select: { id: true, roomName: true, code: true } }
            }
        });
    }

    async delete(userId: string, roomId: string) {
        return prisma.roomParticipant.deleteMany({
            where: { userId, roomId }
        });
    }

    async deleteByRoom(roomId: string) {
        return prisma.roomParticipant.deleteMany({
            where: {roomId }
        });
    }

    async findByUserAndRoom(userId: string, roomId: string) {
        return await prisma.roomParticipant.findFirst({
            where: { userId, roomId }
        });
    }
}

export default new RoomParticipantRepository();