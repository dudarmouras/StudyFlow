"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoomRoutes_1 = __importDefault(require("../routes/RoomRoutes"));
const UserRoutes_1 = __importDefault(require("../routes/UserRoutes"));
const RoomParticipant_1 = __importDefault(require("./RoomParticipant"));
const TasksRoutes_1 = __importDefault(require("./TasksRoutes"));
const LoginRoutes_1 = __importDefault(require("./LoginRoutes"));
const router = express_1.default.Router();
// Room 
router.use('/room', RoomRoutes_1.default);
router.use('/user', UserRoutes_1.default);
router.use('/roomParticipant', RoomParticipant_1.default);
router.use('/tasks', TasksRoutes_1.default);
router.use('/login', LoginRoutes_1.default);
exports.default = router;
