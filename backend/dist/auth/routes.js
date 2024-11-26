"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("./service");
const router = (0, express_1.Router)();
// ログインエンドポイント
const loginHandler = async (req, res) => {
    try {
        const { userId, password } = req.body;
        // 必須フィールドの検証
        if (!userId || !password) {
            res.status(400).json({ error: 'ユーザーIDとパスワードは必須です' });
            return;
        }
        // 認証情報の検証
        const user = await service_1.AuthService.validateCredentials(userId, password);
        // JWTトークンの生成
        const token = service_1.AuthService.generateToken(user);
        // レスポンスの送信
        res.json({
            token,
            user: {
                id: user.id,
                userId: user.userId,
                customerGroup: user.customerGroup,
                roles: user.roles
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'ログインに失敗しました' });
    }
};
router.post('/login', loginHandler);
exports.default = router;
