"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// /api/batteries/search エンドポイント
router.get('/search', async (req, res) => {
    try {
        console.log('Received battery search request');
        console.log('Search params:', req.query);
        // 検索条件の構築
        const whereClause = {};
        // 文字列フィールドの部分一致検索
        if (req.query.lease_company) {
            whereClause.lease_company = {
                contains: String(req.query.lease_company),
                mode: 'insensitive'
            };
        }
        if (req.query.lease_period) {
            whereClause.lease_period = {
                contains: String(req.query.lease_period),
                mode: 'insensitive'
            };
        }
        if (req.query.battery_manufacturer) {
            whereClause.battery_manufacturer = {
                contains: String(req.query.battery_manufacturer),
                mode: 'insensitive'
            };
        }
        if (req.query.model) {
            whereClause.model = {
                contains: String(req.query.model),
                mode: 'insensitive'
            };
        }
        // 数値フィールドの範囲検索
        if (req.query.capacity) {
            whereClause.capcity = Number(req.query.capacity);
        }
        if (req.query.quantity) {
            whereClause.quantity = Number(req.query.quantity);
        }
        // 総容量の範囲検索
        if (req.query.total_capacity_min || req.query.total_capacity_max) {
            whereClause.total_capacity = {
                gte: req.query.total_capacity_min ? Number(req.query.total_capacity_min) : undefined,
                lte: req.query.total_capacity_max ? Number(req.query.total_capacity_max) : undefined,
            };
        }
        // 月額リース料の範囲検索
        if (req.query.monthly_lease_fee_min || req.query.monthly_lease_fee_max) {
            whereClause.monthly_lease_fee = {
                gte: req.query.monthly_lease_fee_min ? Number(req.query.monthly_lease_fee_min) : undefined,
                lte: req.query.monthly_lease_fee_max ? Number(req.query.monthly_lease_fee_max) : undefined,
            };
        }
        // リース料総額の範囲検索
        if (req.query.total_lease_amount_min || req.query.total_lease_amount_max) {
            whereClause.total_lease_amount = {
                gte: req.query.total_lease_amount_min ? Number(req.query.total_lease_amount_min) : undefined,
                lte: req.query.total_lease_amount_max ? Number(req.query.total_lease_amount_max) : undefined,
            };
        }
        if (req.query.customer_group) {
            whereClause.customer_group = {
                contains: String(req.query.customer_group),
                mode: 'insensitive'
            };
        }
        if (req.query.application_code) {
            whereClause.application_code = {
                contains: String(req.query.application_code),
                mode: 'insensitive'
            };
        }
        if (req.query.installation !== undefined) {
            whereClause.installation = req.query.installation === 'true';
        }
        console.log('Final where clause:', JSON.stringify(whereClause, null, 2));
        // 検索実行
        const results = await prisma.batteries.findMany({
            where: whereClause,
        });
        console.log(`Found ${results.length} results`);
        return res.json(results);
    }
    catch (error) {
        console.error('Battery search error:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : '不明なエラーが発生しました',
            details: error instanceof Error ? error.stack : undefined
        });
    }
});
exports.default = router;
