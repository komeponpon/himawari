import express from 'express';
import { Decimal } from '@prisma/client/runtime/library.js';
import { PrismaClient, Prisma } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// /api/solar-systems/search エンドポイント
router.get('/search', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    console.log('Received search request');
    console.log('Search params:', req.query);

    // データベース接続テスト
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({
        error: 'データベース接続エラー',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      });
    }

    // テーブル存在確認
    const tableExists = await prisma.$queryRaw<[{ exists: boolean }]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'solar_system'
      );
    `;
    console.log('Table exists check:', tableExists);

    if (!tableExists[0].exists) {
      return res.status(500).json({
        error: 'テーブルが存在しません',
        details: 'solar_systemテーブルが見つかりません'
      });
    }

    // 検索条件の構築
    const whereClause: any = {};

    // 文字列フィールドの部分一致検索
    if (req.query.lease_company) {
      console.log('Adding lease_company to where clause:', req.query.lease_company);
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

    if (req.query.module_model) {
      whereClause.module_model = {
        contains: String(req.query.module_model),
        mode: 'insensitive'
      };
    }

    if (req.query.pcs_manufacturer) {
      whereClause.pcs_manufacturer = {
        contains: String(req.query.pcs_manufacturer),
        mode: 'insensitive'
      };
    }

    if (req.query.region) {
      whereClause.region = {
        contains: String(req.query.region),
        mode: 'insensitive'
      };
    }

    if (req.query.roof_material) {
      whereClause.roof_material = {
        contains: String(req.query.roof_material),
        mode: 'insensitive'
      };
    }

    if (req.query.installation_points) {
      whereClause.installation_points = {
        contains: String(req.query.installation_points),
        mode: 'insensitive'
      };
    }

    // 数値フィールドの範囲検索
    if (req.query.module_count) {
      whereClause.module_count = Number(req.query.module_count);
    }

    // パネル合計出力の範囲検索
    if (req.query.total_module_output_min || req.query.total_module_output_max) {
      whereClause.total_module_output = {
        gte: req.query.total_module_output_min ? Number(req.query.total_module_output_min) : undefined,
        lte: req.query.total_module_output_max ? Number(req.query.total_module_output_max) : undefined,
      };
    }

    // 申請出力の処理を修正
    if (req.query.application_power_output) {
      const rawValue = String(req.query.application_power_output);
      whereClause.application_power_output = new Decimal(rawValue);
      console.log('Application Power Output Debug:', {
        rawValue,
        whereClause: whereClause.application_power_output
      });
    }

    // 月額リース料(1-10年)の範囲検索
    if (req.query.monthly_lease_fee_min || req.query.monthly_lease_fee_max) {
      whereClause.monthly_lease_fee_10 = {
        gte: req.query.monthly_lease_fee_min ? Number(req.query.monthly_lease_fee_min) : undefined,
        lte: req.query.monthly_lease_fee_max ? Number(req.query.monthly_lease_fee_max) : undefined,
      };
    }

    // 月額リース料(10-15年)の範囲検索
    if (req.query.monthly_lease_fee_10_to_15_year_min || req.query.monthly_lease_fee_10_to_15_year_max) {
      whereClause.monthly_lease_fee_15 = {
        gte: req.query.monthly_lease_fee_10_to_15_year_min ? Number(req.query.monthly_lease_fee_10_to_15_year_min) : undefined,
        lte: req.query.monthly_lease_fee_10_to_15_year_max ? Number(req.query.monthly_lease_fee_10_to_15_year_max) : undefined,
      };
    }

    // 総額リース料の範囲検索
    if (req.query.total_lease_fee_min || req.query.total_lease_fee_max) {
      whereClause.total_lease_amount = {
        gte: req.query.total_lease_fee_min ? Number(req.query.total_lease_fee_min) : undefined,
        lte: req.query.total_lease_fee_max ? Number(req.query.total_lease_fee_max) : undefined,
      };
    }

    if (req.query.application_code) {
      whereClause.application_code = {
        contains: String(req.query.application_code),
        mode: 'insensitive'
      };
    }

    if (req.query.installation !== undefined) {
      const installationValue = req.query.installation === 'true';
      whereClause.installation = installationValue;

      console.log('Installation query param:', req.query.installation);
      console.log('Converted installation value:', installationValue);
      console.log('Where clause installation:', whereClause.installation);
    }

    if (req.query.sll !== undefined) {
      const sllValue = req.query.sll === 'true';
      whereClause.sll = sllValue;
    }

    console.log('Final where clause:', JSON.stringify(whereClause, null, 2));

    // 検索実行
    const results = await prisma.solar_system.findMany({
      where: whereClause,
    });

    console.log(`Found ${results.length} results`);
    console.log('First result installation value:', results[0]?.installation);

    return res.json(results);

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

export default router;