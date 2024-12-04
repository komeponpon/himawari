import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// /api/construction-costs/search エンドポイント
router.get('/search', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    console.log('Received construction cost search request');
    console.log('Search params:', req.query);

    // 検索条件の構築
    const whereClause: any = {};

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

    if (req.query.large_category) {
      whereClause.large_category = {
        contains: String(req.query.large_category),
        mode: 'insensitive'
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

    if (req.query.application_code) {
      whereClause.application_code = {
        contains: String(req.query.application_code),
        mode: 'insensitive'
      };
    }

    console.log('Final where clause:', JSON.stringify(whereClause, null, 2));

    // 検索実行
    const results = await prisma.construction_costs.findMany({
      where: whereClause,
    });

    console.log(`Found ${results.length} results`);
    return res.json(results);

  } catch (error) {
    console.error('Construction cost search error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

export default router;