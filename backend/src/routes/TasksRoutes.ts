import { Router } from 'express';
import { TasksController } from '../controller';
import { authMiddleware } from '../middleware/authMiddleware';

const TasksRoutes = Router();

TasksRoutes.post('/create', authMiddleware, TasksController.create);
TasksRoutes.put('/:id', authMiddleware, TasksController.update);
TasksRoutes.get('/room/:roomId', authMiddleware, TasksController.readByRoomId);
TasksRoutes.get('/user/:userId', authMiddleware, TasksController.readByUser);
TasksRoutes.delete('/:id', authMiddleware, TasksController.delete);

export default TasksRoutes;