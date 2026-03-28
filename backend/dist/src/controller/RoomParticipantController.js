"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
class RoomParticipantController {
    async readByRoom(req, res, next) {
        try {
            const roomId = req.params.roomId;
            const roomParticipant = repository_1.RoomParticipantRepository.findByRoom(roomId);
            res.status(200).json({ data: roomParticipant });
        }
        catch (error) {
            return next(error);
        }
    }
    async readByUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const rooms = repository_1.RoomParticipantRepository.findByUser(userId);
            res.status(200).json({ data: rooms });
        }
        catch (error) {
            return next(error);
        }
    }
    // Remove a participant from the room
    async leave(req, res, next) {
        try {
            const roomId = req.params.roomId;
            const userId = req.user?.id;
            await repository_1.RoomParticipantRepository.delete(userId, roomId);
            res.status(200).json({ message: 'Left the room sucessfully' });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.default = new RoomParticipantController();
