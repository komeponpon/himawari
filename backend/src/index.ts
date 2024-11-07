import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ルートパスのテスト用エンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// 検索APIのエンドポイント
app.get('/api/solar-systems/search', async (req, res) => {
  try {
    console.log('Search params:', req.query);

    const whereClause: any = {};

    // 文字列フィールドの部分一致検索
    if (req.query.lease_company) {
      whereClause.lease_company = {
        contains: String(req.query.lease_company),
        mode: 'insensitive'  // 大文字小文字を区別しない
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

    console.log('Where clause:', whereClause);

    const results = await prisma.solar_system.findMany({
      where: whereClause,
    });

    console.log('Search results:', results);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    res.status(500).json({ error: errorMessage });
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
