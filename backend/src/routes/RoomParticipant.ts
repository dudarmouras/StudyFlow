import { Router } from 'express';
import { RoomParticipantController } from '../controller';
import { authMiddleware } from '../middleware/authMiddleware';

const RoomParticipantRoutes = Router();

// Private

RoomParticipantRoutes.get('/room/:roomId',authMiddleware, RoomParticipantController.readByRoom);
RoomParticipantRoutes.get('/user/:userId', authMiddleware,RoomParticipantController.readByUser);
RoomParticipantRoutes.delete('/room/:roomId/leave', authMiddleware, RoomParticipantController.leave);

export default RoomParticipantRoutes;