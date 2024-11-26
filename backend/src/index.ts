import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { corsOptions } from './config/corsConfig';
import solarSystemsRouter from './routes/solarSystems';
import batteriesRouter from './routes/batteries';
import constructionCostsRouter from './routes/constructionCosts';
import authRouter from './auth/routes';

const app = express();
const prisma = new PrismaClient();

app.use(cors(corsOptions));
app.use(express.json());

// ルートパスのテスト用エンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// ルーターの設定
app.use('/api/solar-systems', solarSystemsRouter);
app.use('/api/batteries', batteriesRouter);
app.use('/api/construction-costs', constructionCostsRouter);
app.use('/api/auth', authRouter);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
