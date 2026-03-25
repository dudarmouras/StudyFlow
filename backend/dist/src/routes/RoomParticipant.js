"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const RoomParticipantRoutes = (0, express_1.Router)();
// Private
RoomParticipantRoutes.get('/room/:roomId', authMiddleware_1.authMiddleware, controller_1.RoomParticipantController.readByRoom);
RoomParticipantRoutes.get('/user/:userId', authMiddleware_1.authMiddleware, controller_1.RoomParticipantController.readByUser);
RoomParticipantRoutes.delete('/room/:roomId/leave', authMiddleware_1.authMiddleware, controller_1.RoomParticipantController.leave);
exports.default = RoomParticipantRoutes;
