"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
const DTOs_1 = require("../DTOs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client/runtime/client");
class UserController {
    // Creating user with DTO validation and Repository functions
    async create(req, res, next) {
        try {
            const userData = DTOs_1.User.safeParse(req.body);
            if (!userData.success) {
                const error = userData.error.issues.map((err) => err.message);
                res.status(400).json({
                    message: error[0]
                });
                return;
            }
            const hashedPassword = await bcryptjs_1.default.hash(userData.data.password, 8);
            const user = await repository_1.UserRepository.create({
                ...userData.data,
                password: hashedPassword,
            });
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({
                message: 'User created',
                data: user,
                token
            });
            ;
        }
        catch (error) {
            if (error instanceof client_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    res.status(409).json({ message: 'Email já cadastrado' });
                    return;
                }
            }
            return next(error);
        }
    }
    // Gets user info based on their id via params (url), admin
    async read(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await repository_1.UserRepository.findById(userId);
            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
                return;
            }
            // Returns the user data
            res.status(200).json({
                data: user
            });
        }
        catch (error) {
            return next(error);
        }
    }
    // Updates user info
    async update(req, res, next) {
        try {
            const userId = req.params.id;
            const userData = DTOs_1.UpdateUser.safeParse(req.body);
            if (!userData.success) {
                const error = userData.error.issues.map((err) => err.message);
                res.status(400).json({ message: error[0] });
                return;
            }
            const user = await repository_1.UserRepository.update(userId, userData.data);
            res.status(200).json({
                message: 'User updated',
                data: user
            });
        }
        catch (error) {
            return next(error);
        }
    }
    // Delete the user via id
    async delete(req, res, next) {
        try {
            const userId = req.params.id;
            await repository_1.UserRepository.delete(userId);
            res.status(200).json({
                message: 'User deleted'
            });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.default = new UserController();
