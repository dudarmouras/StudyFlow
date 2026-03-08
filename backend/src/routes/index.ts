import express from 'express'
import RoomRoutes from '../routes'
const router = express.Router()

// Room 
router.use('/room', RoomRoutes);

export default router