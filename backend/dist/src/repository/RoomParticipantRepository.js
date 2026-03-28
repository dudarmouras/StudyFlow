"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class RoomParticipantRepository {
    async create(data) {
        return database_1.default.roomParticipant.create({ data });
    }
    async findByRoom(roomId) {
        return database_1.default.roomParticipant.findMany({
            where: { roomId },
            include: {
                user: { select: { id: true, name: true } }
            }
        });
    }
    async findByUser(userId) {
        return database_1.default.roomParticipant.findMany({
            where: { userId },
            include: {
                room: { select: { id: true, roomName: true, code: true } }
            }
        });
    }
    async delete(userId, roomId) {
        return database_1.default.roomParticipant.deleteMany({
            where: { userId, roomId }
        });
    }
}
exports.default = new RoomParticipantRepository();
