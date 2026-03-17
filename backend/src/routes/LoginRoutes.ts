import { Router } from 'express';
import { LoginController } from '../controller';

const LoginRoutes = Router();

// Login
LoginRoutes.post('/', LoginController.create);

export default LoginRoutes;