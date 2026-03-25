"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller");
const LoginRoutes = (0, express_1.Router)();
// Login
LoginRoutes.post('/', controller_1.LoginController.create);
exports.default = LoginRoutes;
