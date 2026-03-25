"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const crypto_1 = require("crypto");
class RoomRepository {
    generateCode() {
        return (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase(); // ex: A3F9B2
    }
    async create(data) {
        const room = await database_1.default.room.create({ data: {
                code: this.generateCode(),
                password: data.password,
                roomName: data.roomName
            }
        });
        return room;
    }
    async update(id, data) {
        const room = await database_1.default.room.update({ where: { id }, data });
        return room;
    }
    async findById(id) {
        const room = await database_1.default.room.findUnique({ where: { id } });
        return room;
    }
    async findByCode(code) {
        const room = await database_1.default.room.findUnique({ where: { code } });
        return room;
    }
    async findAll() {
        const rooms = await database_1.default.room.findMany();
        return rooms;
    }
    async delete(id) {
        const room = await database_1.default.room.delete({ where: { id } });
        return room;
    }
}
exports.default = new RoomRepository();
