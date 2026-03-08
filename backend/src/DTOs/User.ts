import {z} from 'zod';

export const User = z.object({
    name: z
        .string({
            error: 'O nome deve ser uma string e é obrigatória',
        })
        .min(3, {
            message: 'O nome deve ter no mínimo 3 caracteres',
        }),
});

export const UpdateUser = User.partial();