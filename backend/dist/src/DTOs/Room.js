"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoom = exports.JoinRoom = exports.CreateRoom = void 0;
const zod_1 = require("zod");
exports.CreateRoom = zod_1.z.object({
    password: zod_1.z
        .string({
        error: 'A senha é obrigatória'
    })
        .min(4, {
        message: 'A senha deve ter no mínimo 4 caracteres'
    }),
    roomName: zod_1.z
        .string({
        error: 'O nome da sala é obrigatório'
    })
});
exports.JoinRoom = zod_1.z.object({
    code: zod_1.z
        .string({
        error: 'O código é obrigatório'
    }),
    password: zod_1.z
        .string({
        error: 'A senha é obrigatória'
    })
        .min(4, {
        message: 'A senha deve ter no mínimo 4 caracteres'
    }),
});
exports.UpdateRoom = exports.CreateRoom.partial();
