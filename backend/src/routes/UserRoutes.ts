import { Router } from 'express';
import { UserController } from '../controller';

const UserRoutes = Router();

// Create User
UserRoutes.post('/', UserController.create);

// Read User
UserRoutes.get('/:id', UserController.read);

// Update User
UserRoutes.put('/:id', UserController.update);

//Delete User
UserRoutes.delete('/:id', UserController.delete);

export default UserRoutes;