"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTasks = exports.Tasks = void 0;
const zod_1 = require("zod");
exports.Tasks = zod_1.z.object({
    title: zod_1.z
        .string({
        error: 'O título deve ser uma string e é obrigatória',
    }),
    isDone: zod_1.z
        .boolean({
        error: 'A tarefa ou foi feita, ou não foi feita',
    }),
    userId: zod_1.z.uuid(),
    roomId: zod_1.z.uuid(),
});
exports.UpdateTasks = exports.Tasks.partial();
