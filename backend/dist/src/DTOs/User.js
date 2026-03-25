"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.UpdateUser = exports.User = void 0;
const zod_1 = require("zod");
exports.User = zod_1.z.object({
    name: zod_1.z
        .string({
        error: 'O nome deve ser uma string e é obrigatória',
    })
        .min(3, {
        message: 'O nome deve ter no mínimo 3 caracteres',
    }),
    email: zod_1.z
        .email({
        error: 'Endereço de email inválido'
    }),
    password: zod_1.z
        .string({
        error: 'A senha deve ser uma string e é obrigatória',
    })
        .min(8, {
        message: 'A senha deve ter no mínimo 8 caracteres'
    }),
});
exports.UpdateUser = exports.User.partial();
exports.Login = zod_1.z.object({
    email: zod_1.z.email('Digite um email válido'),
    password: zod_1.z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});
