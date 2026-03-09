import { Router } from 'express';
import { UserController } from '../controller';

const UserRoutes = Router();

// Creating my first public route for the User creation
UserRoutes.post('/', UserController.create);

export default UserRoutes;