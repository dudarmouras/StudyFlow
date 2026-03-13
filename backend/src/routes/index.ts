import express from 'express'
import RoomRoutes from '../routes/RoomRoutes';
import UserRoutes from '../routes/UserRoutes';
import RoomParticipantRoutes from './RoomParticipant';
import TasksRoutes from './TasksRoutes';

const router = express.Router()

// Room 
router.use('/room', RoomRoutes);
router.use('/user', UserRoutes);
router.use('/roomParticipant', RoomParticipantRoutes)
router.use('/tasks', TasksRoutes);

export default router