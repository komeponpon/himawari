import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

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

    if (req.query.total_module_output_min || req.query.total_module_output_max) {
      whereClause.total_module_output = {
        gte: req.query.total_module_output_min ? Number(req.query.total_module_output_min) : undefined,
        lte: req.query.total_module_output_max ? Number(req.query.total_module_output_max) : undefined,
      };
    }

    if (req.query.monthly_lease_fee_min || req.query.monthly_lease_fee_max) {
      whereClause.monthly_lease_fee = {
        gte: req.query.monthly_lease_fee_min ? Number(req.query.monthly_lease_fee_min) : undefined,
        lte: req.query.monthly_lease_fee_max ? Number(req.query.monthly_lease_fee_max) : undefined,
      };
    }

    if (req.query.application_code) {
      whereClause.application_code = {
        contains: String(req.query.application_code),
        mode: 'insensitive'
      };
    }

    console.log('Executing search with where clause:', JSON.stringify(whereClause, null, 2));

    // 検索実行
    const results = await prisma.solar_system.findMany({
      where: whereClause,
    });

    console.log(`Found ${results.length} results`);
    
    return res.json(results);

  } catch (error) {
    console.error('Search error:', error);
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
