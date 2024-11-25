import express from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.0.191:3000',
    'http://frontend:3000',
    'http://localhost:5001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ルートパスのテスト用エンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 検索APIのエンドポイント
app.get('/api/solar-systems/search', async (req: express.Request, res: express.Response): Promise<any> => {
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
      whereClause.application_power_output = new Prisma.Decimal(rawValue);
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

// 蓄電池検索APIのエンドポイント
app.get('/api/batteries/search', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    console.log('Received battery search request');
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

  } catch (error) {
    console.error('Battery search error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      details: error instanceof Error ? error.stack : undefined
    });
  }
});

// 工事費用検索APIのエンドポイント
app.get('/api/construction-costs/search', async (req: express.Request, res: express.Response): Promise<any> => {
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

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
