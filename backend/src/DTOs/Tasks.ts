import {z} from 'zod';

export const Tasks = z.object({
    title: z
        .string({
            error: 'O título deve ser uma string e é obrigatória',
        }),
    isDone: z
        .boolean({ 
            error: 'A tarefa ou foi feita, ou não foi feita', 
        }),
    userId: z.uuid(),
    roomId: z.uuid(),
    });

export const UpdateTasks = Tasks.partial();