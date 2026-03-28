"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
// Creating the most used operations for User as create, update, delete, findbyid (get) and findbyemail(get)
class UserRepository {
    async create(data) {
        const user = await database_1.default.user.create({ data });
        return user;
    }
    async update(id, data) {
        const user = await database_1.default.user.update({ where: { id }, data });
        return user;
    }
    async findById(id) {
        const user = await database_1.default.user.findUnique({ where: { id } });
        return user;
    }
    async findByEmail(email) {
        const user = await database_1.default.user.findUnique({ where: { email } });
        return user;
    }
    async delete(id) {
        const user = await database_1.default.user.delete({ where: { id } });
        return user;
    }
}
exports.default = new UserRepository();
