"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerGroupFilter = exports.authenticateToken = void 0;
const service_1 = require("./service");
// 認証ミドルウェア
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: '認証が必要です' });
        }
        const user = await service_1.AuthService.validateToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'トークンが無効です' });
    }
};
exports.authenticateToken = authenticateToken;
// customer_groupによるアクセス制御
const customerGroupFilter = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: '認証が必要です' });
    }
    // 管理者ロールの場合はフィルタリングをスキップ
    if (req.user.roles.includes('admin')) {
        return next();
    }
    // ユーザーのcustomer_groupをリクエストに追加
    req.query.customer_group = req.user.customerGroup;
    next();
};
exports.customerGroupFilter = customerGroupFilter;
