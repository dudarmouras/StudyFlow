import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repository';
import { Login } from '../DTOs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class LoginController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData = Login.safeParse(req.body);

      if (!loginData.success) {
        const error = loginData.error.issues.map((err) => err.message);
        res.status(400).json({ message: error[0] });
        return;
      }

      const user = await UserRepository.findByEmail(loginData.data.email);

      if (!user) {
        res.status(401).json({ message: 'Email inválido' });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        loginData.data.password,
        user.password
      );

      if (!passwordMatch) {
        res.status(401).json({ message: 'Senha inválida' });
        return;
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        message: 'Login realizado com sucesso',
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      });

    } catch (error) {
      return next(error);
    }
  }
}

export default new LoginController();