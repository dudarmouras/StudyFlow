"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const RoomRoutes = (0, express_1.Router)();
// Private Routes
RoomRoutes.post('/create', authMiddleware_1.authMiddleware, controller_1.RoomController.create);
RoomRoutes.post('/join', authMiddleware_1.authMiddleware, controller_1.RoomController.join);
// Operations
RoomRoutes.get('/', authMiddleware_1.authMiddleware, controller_1.RoomController.readAll);
RoomRoutes.get('/:id', authMiddleware_1.authMiddleware, controller_1.RoomController.readById);
RoomRoutes.get('/code/:code', authMiddleware_1.authMiddleware, controller_1.RoomController.readByCode);
RoomRoutes.put('/:id', authMiddleware_1.authMiddleware, controller_1.RoomController.update);
RoomRoutes.delete('/:id', authMiddleware_1.authMiddleware, controller_1.RoomController.delete);
exports.default = RoomRoutes;
