import { Request, Response, NextFunction } from 'express';
import { RoomParticipantRepository } from  '../repository'

class RoomParticipantController {

    async readByRoom(req: Request, res: Response, next: NextFunction){
        try{
            const roomId = req.params.roomId as string;
            const roomParticipant = RoomParticipantRepository.findByRoom(roomId);

            res.status(200).json({ data: roomParticipant });
        }
        catch(error){
            return next(error);
        }
    }

    async readByUser(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.userId as string;
            const rooms = RoomParticipantRepository.findByUser(userId);

            res.status(200).json({ data: rooms });
        }
        catch(error){
            return next(error);
        }
    }

    // Remove a participant from the room
    async leave(req: Request, res: Response, next: NextFunction){
        try{
            const roomId = req.params.roomId as string;
            const userId = req.user?.id as string;

            await RoomParticipantRepository.delete(userId, roomId);
            res.status(200).json({ message: 'Left the room sucessfully' });
        }
        catch(error){
            return next(error);
        }
    }
}

export default new RoomParticipantController();