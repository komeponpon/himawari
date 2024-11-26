"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class AuthService {
    static async validateCredentials(userId, password) {
        const user = await prisma.users.findUnique({
            where: { userId }
        });
        if (!user) {
            throw new Error('ユーザーが見つかりません');
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            throw new Error('パスワードが正しくありません');
        }
        return user;
    }
    static async validateToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user.id,
            userId: user.userId,
            customerGroup: user.customerGroup,
            roles: user.roles
        }, config_1.config.jwt.secret, { expiresIn: '24h' });
    }
}
exports.AuthService = AuthService;
