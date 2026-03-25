"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller");
const UserRoutes = (0, express_1.Router)();
// Create User
UserRoutes.post('/', controller_1.UserController.create);
// Read User
UserRoutes.get('/:id', controller_1.UserController.read);
// Update User
UserRoutes.put('/:id', controller_1.UserController.update);
//Delete User
UserRoutes.delete('/:id', controller_1.UserController.delete);
exports.default = UserRoutes;
