import { RoomRepository } from "../repository";
import { Request, Response, NextFunction } from 'express';
import { CreateRoom, UpdateRoom, JoinRoom } from '../DTOs'
import { compare , hash } from 'bcryptjs';

// Lembrar do hash password + o code autogerado
class RoomController {

    async create(req: Request, res: Response, next: NextFunction){
        try{

            // Confirm is a valid user creating the room
            const userId = req.user?.id; 

            if (!userId) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }


            const roomData = CreateRoom.safeParse(req.body);

             if(!roomData.success){
                const error = roomData.error.issues.map((err) => err.message);

                res.status(400).json({
                    message: error[0]
                     });
                
                return;
            }

            const hashedPassword = await hash(roomData.data.password, 6);
            const room = await RoomRepository.create( 
                {...roomData.data,
                password: hashedPassword}
                );
            
             // Creator as a room participant
            await RoomParticipantRepository.create({userId, roomId: room.id,});
                
            res.status(201).json({ 
                    message: 'Room created', 
                    data: { 
                        roomId: room.id,
                        code: room.code,
                        roomName: room.roomName,
                    },
            });;
        }
        catch(error){
            return next(error);

        }
    }

    async update(req: Request, res: Response, next: NextFunction){
        try{
            const roomId = req.params.id as string;
            const roomData = UpdateRoom.safeParse(req.body)

            if(!roomData.success){
                const error = roomData.error.issues.map((err) => err.message);

                res.status(400).json({
                    message: error[0]
                     });
                
                return;
            }

            if(roomData.data.password){
                roomData.data.password = await hash(roomData.data.password, 6);
            }

            const room = await RoomRepository.update( roomId, roomData.data );
                res.status(201).json({ 
                    message: 'Room updated', 
                    data: room,
            });;

        }

        catch(error){
            return next(error);
        }
    }

    async delete(req: Request , res: Response, next: NextFunction){
        try{
            const roomId = req.params.id as string;
            const room = await RoomRepository.delete( roomId );

              if (!room) {
                res.status(404).json({ 
                    message: 'Room not found' 
                });
                return;
            }
                res.status(200).json({ 
                    message: 'Room deleted' 
                });
            }

        catch(error){
            return next(error);
        }
    }

    // Join room by validating code + password
    async join(req: Request, res: Response, next: NextFunction){
        try{

            // Confirm that is a valid user
            const userId = req.user?.id;

             if (!userId) {
                res.status(401).json({ message: 'Not authorized User' });
                return;
            }

            const joinData = JoinRoom.safeParse(req.body);

            if (!joinData.success) {
                const error = joinData.error.issues.map((err) => err.message);
                res.status(400).json({ message: error[0] });
                return;
            }

            const room = await RoomRepository.findByCode( joinData.data.code);

             if (!room) {
                res.status(404).json({ message: 'Room not found' });
                return;
            }

            const isPasswordRight = await compare(joinData.data.password, room.password);

            if(!isPasswordRight){
                res.status(401).json({ message: 'Incorrect password' });
                return;
            }
           
            await RoomParticipantRepository.create({
                userId,
                roomId: room.id,
            });

            res.status(200).json({
                message: 'Joined the room', 
                data: room 
            });
        }
        catch(error){
            return next(error);
        }
    }

    async readById(req: Request, res: Response, next: NextFunction){
        try{
            const roomId = req.params.id as string;
            const room = await RoomRepository.findById( roomId );
            
            if(!room){
                res.status(404).json({ 
                message: 'Room not found' 
            });

            res.status(200).json({ 
                data: room 
            });
                return;
            }
        }

        catch(error){
            return next(error);
        }
    }

    async readByCode(req: Request, res: Response, next: NextFunction){
        try{
            const roomCode = req.params.code as string;
            const room = await RoomRepository.findByCode( roomCode );

            if(!room){
                res.status(404).json({ 
                message: 'Room not found' 
            });

            res.status(200).json({ 
                data: room 
            });
                return;
            }
        }
        catch(error){
            return next(error);
        }
    }

    async readAll(req: Request, res: Response, next: NextFunction){
        try{
            const rooms = await RoomRepository.findAll();
            res.status(200).json({ data: rooms });
        }
        catch(error){
            return next(error);
        }
    }
}

export default new RoomController();