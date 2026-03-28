"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = exports.TasksController = exports.RoomParticipantController = exports.RoomController = exports.UserController = void 0;
const UserController_1 = __importDefault(require("./UserController"));
exports.UserController = UserController_1.default;
const RoomController_1 = __importDefault(require("./RoomController"));
exports.RoomController = RoomController_1.default;
const RoomParticipantController_1 = __importDefault(require("./RoomParticipantController"));
exports.RoomParticipantController = RoomParticipantController_1.default;
const TasksController_1 = __importDefault(require("./TasksController"));
exports.TasksController = TasksController_1.default;
const LoginController_1 = __importDefault(require("./LoginController"));
exports.LoginController = LoginController_1.default;
