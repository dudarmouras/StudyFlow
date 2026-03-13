import { Router } from 'express';
import { RoomController } from '../controller';
import { authMiddleware } from '../middleware/authMiddleware';

const RoomRoutes = Router();

// Private Routes
RoomRoutes.post('/create', authMiddleware, RoomController.create);
RoomRoutes.post('/join', authMiddleware, RoomController.join);  

// Operations
RoomRoutes.get('/', authMiddleware, RoomController.readAll);
RoomRoutes.get('/:id', authMiddleware, RoomController.readById);
RoomRoutes.get('/code/:code', authMiddleware, RoomController.readByCode);
RoomRoutes.put('/:id', authMiddleware, RoomController.update);
RoomRoutes.delete('/:id', authMiddleware, RoomController.delete);

export default RoomRoutes;