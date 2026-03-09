import express from 'express'
import RoomRoutes from '../routes/RoomRoutes';
import UserRoutes from '../routes/UserRoutes';

const router = express.Router()

// Room 
router.use('/room', RoomRoutes);
router.use('/user', UserRoutes);

export default router