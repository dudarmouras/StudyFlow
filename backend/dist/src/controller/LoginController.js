"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
const DTOs_1 = require("../DTOs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class LoginController {
    async create(req, res, next) {
        try {
            const loginData = DTOs_1.Login.safeParse(req.body);
            if (!loginData.success) {
                const error = loginData.error.issues.map((err) => err.message);
                res.status(400).json({ message: error[0] });
                return;
            }
            const user = await repository_1.UserRepository.findByEmail(loginData.data.email);
            if (!user) {
                res.status(401).json({ message: 'Email inválido' });
                return;
            }
            const passwordMatch = await bcryptjs_1.default.compare(loginData.data.password, user.password);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Senha inválida' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
            });
            res.status(200).json({
                message: 'Login realizado com sucesso',
                token, // mantém no body também, pro localStorage no client
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.default = new LoginController();
