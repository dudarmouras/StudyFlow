import {z} from 'zod';

export const User = z.object({
    name: z
        .string({
            error: 'O nome deve ser uma string e é obrigatória',
        })
        .min(3, {
            message: 'O nome deve ter no mínimo 3 caracteres',
        }),
    email: z
        .email({ 
            error: 'Endereço de email inválido' 
        }),
        
    password: z
        .string({
            error: 'A senha deve ser uma string e é obrigatória',
        })
        .min(8, { 
            message: 'A senha deve ter no mínimo 8 caracteres' 
        }),
    });

export const UpdateUser = User.partial();