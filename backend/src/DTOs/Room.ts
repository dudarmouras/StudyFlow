import { z } from 'zod';

export const CreateRoom = z.object({
    password: z
        .string({ 
            error: 'A senha é obrigatória' 
        })
        .min(4, { 
            message: 'A senha deve ter no mínimo 4 caracteres' 
        }),
        
    roomName: z
        .string({
            error: 'O nome da sala é obrigatório'
        })
});

export const JoinRoom = z.object({
    code: z
        .string({
            error: 'O código é obrigatório' 
        }),
    password: z
        .string({ 
            error: 'A senha é obrigatória' 
        }),
});

export const UpdateRoom = CreateRoom.partial();