"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
const DTOs_1 = require("../DTOs");
const bcryptjs_1 = require("bcryptjs");
// Lembrar do hash password + o code autogerado
class RoomController {
    async create(req, res, next) {
        try {
            // Confirm is a valid user creating the room
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            const roomData = DTOs_1.CreateRoom.safeParse(req.body);
            if (!roomData.success) {
                const error = roomData.error.issues.map((err) => err.message);
                res.status(400).json({
                    message: error[0]
                });
                return;
            }
            const hashedPassword = await (0, bcryptjs_1.hash)(roomData.data.password, 6);
            const room = await repository_1.RoomRepository.create({ ...roomData.data,
                password: hashedPassword });
            // Creator as a room participant
            await repository_1.RoomParticipantRepository.create({ userId, roomId: room.id, });
            res.status(201).json({
                message: 'Room created',
                data: {
                    roomId: room.id,
                    code: room.code,
                    roomName: room.roomName,
                },
            });
            ;
        }
        catch (error) {
            return next(error);
        }
    }
    async update(req, res, next) {
        try {
            const roomId = req.params.id;
            const roomData = DTOs_1.UpdateRoom.safeParse(req.body);
            if (!roomData.success) {
                const error = roomData.error.issues.map((err) => err.message);
                res.status(400).json({
                    message: error[0]
                });
                return;
            }
            if (roomData.data.password) {
                roomData.data.password = await (0, bcryptjs_1.hash)(roomData.data.password, 6);
            }
            const room = await repository_1.RoomRepository.update(roomId, roomData.data);
            res.status(201).json({
                message: 'Room updated',
                data: room,
            });
            ;
        }
        catch (error) {
            return next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const roomId = req.params.id;
            const room = await repository_1.RoomRepository.delete(roomId);
            if (!room) {
                res.status(404).json({
                    message: 'Room not found'
                });
                return;
            }
            res.status(200).json({
                message: 'Room deleted'
            });
        }
        catch (error) {
            return next(error);
        }
    }
    // Join room by validating code + password
    async join(req, res, next) {
        try {
            // Confirm that is a valid user
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Not authorized User' });
                return;
            }
            const joinData = DTOs_1.JoinRoom.safeParse(req.body);
            if (!joinData.success) {
                const error = joinData.error.issues.map((err) => err.message);
                res.status(400).json({ message: error[0] });
                return;
            }
            const room = await repository_1.RoomRepository.findByCode(joinData.data.code);
            if (!room) {
                res.status(404).json({ message: 'Room not found' });
                return;
            }
            const isPasswordRight = await (0, bcryptjs_1.compare)(joinData.data.password, room.password);
            if (!isPasswordRight) {
                res.status(401).json({ message: 'Incorrect password' });
                return;
            }
            await repository_1.RoomParticipantRepository.create({
                userId,
                roomId: room.id,
            });
            res.status(200).json({
                message: 'Joined the room',
                data: room
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async readById(req, res, next) {
        try {
            const roomId = req.params.id;
            const room = await repository_1.RoomRepository.findById(roomId);
            if (!room) {
                res.status(404).json({
                    message: 'Room not found'
                });
            }
            res.status(200).json({
                data: room
            });
            return;
        }
        catch (error) {
            return next(error);
        }
    }
    async readByCode(req, res, next) {
        try {
            const roomCode = req.params.code;
            const room = await repository_1.RoomRepository.findByCode(roomCode);
            if (!room) {
                res.status(404).json({
                    message: 'Room not found'
                });
            }
            res.status(200).json({
                data: room
            });
            return;
        }
        catch (error) {
            return next(error);
        }
    }
    async readAll(req, res, next) {
        try {
            const rooms = await repository_1.RoomRepository.findAll();
            res.status(200).json({ data: rooms });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.default = new RoomController();
