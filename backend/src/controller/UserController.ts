import { Request, Response, NextFunction } from 'express';
import { UserRepository } from  '../repository'
import { User, UpdateUser } from '../DTOs'
import jwt from 'jsonwebtoken';

class UserController {

    // Creating user with DTO validation and Repository functions
    async create(req: Request, res: Response, next: NextFunction ){
        try{
            const userData = User.safeParse(req.body);

            if(!userData.success){
                const error = userData.error.issues.map((err) => err.message);

                res.status(400).json({
                    message: error[0]
                     });
                
                return;
            }

            const user = await UserRepository.create( userData.data );
            
            const token = jwt.sign(
                { id: user.id },                          
                process.env.JWT_SECRET as string,        
                { expiresIn: '7d' }                      
            );

            res.status(201).json({ 
                message: 'User created', 
                data: user ,
                token
            });;

        }
        catch(error){
            return next(error);
        }
    }

    // Gets user info based on their id via params (url), admin
    async read(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.id as string;

            const user = await UserRepository.findById( userId );

            if (!user) {
                res.status(404).json({ 
                    message: 'User not found' 
                });
                return;
            }

            // Returns the user data
            res.status(200).json({ 
                data: user 
            });
        }
        catch(error){
            return next(error);
        }
    }

    // Updates user info
    async update (req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.id as string;
            const userData = UpdateUser.safeParse( req.body );

            if(!userData.success){
                const error = userData.error.issues.map((err) => err.message);
                
                res.status(400).json({ message: error[0] });
                return;
            }
            
            const user = await UserRepository.update(userId , userData.data) 
                res.status(200).json({ 
                    message: 'User updated', 
                    data: user 
                });
        }
        catch(error){
            return next(error);
        }
    }

    // Delete the user via id
    async delete(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.id as string;

            await UserRepository.delete( userId );
                res.status(200).json({ 
                    message: 'User deleted' 
                });
        }
        catch(error){
            return next(error);
        }
    }
}

export default new UserController();