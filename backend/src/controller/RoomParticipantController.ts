import { Request, Response, NextFunction } from 'express';
import { RoomParticipantRepository, RoomRepository, TasksRepository } from  '../repository'
import { io } from '../server' 

class RoomParticipantController {

    async readByRoom(req: Request, res: Response, next: NextFunction){
        try{
            const roomId = req.params.roomId as string;
            const roomParticipant = await RoomParticipantRepository.findByRoom(roomId);

            res.status(200).json({ data: roomParticipant });
        }
        catch(error){
            return next(error);
        }
    }

    async readByUser(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.userId as string;
            const rooms = await RoomParticipantRepository.findByUser(userId);

            res.status(200).json({ data: rooms });
        }
        catch(error){
            return next(error);
        }
    }

    // Remove a participant from the room
    async leave(req: Request, res: Response, next: NextFunction) {
    try {
        const roomId = req.params.roomId as string
        const userId = req.user?.id as string

        await RoomParticipantRepository.delete(userId, roomId)

        io.to(roomId).emit('participant-left', userId)
        io.to(roomId).emit('user-tasks-cleared', userId)

        const remaining = await RoomParticipantRepository.findByRoom(roomId)

        if (remaining.length === 0) {
        io.to(roomId).emit('room-closed')
        await TasksRepository.deleteByRoom(roomId)   
        await RoomParticipantRepository.deleteByRoom(roomId)
        await RoomRepository.delete(roomId)   
        }

        res.status(200).json({ message: 'Left the room successfully' })
    } catch (error) {
        return next(error)
    }
    }
}

export default new RoomParticipantController();