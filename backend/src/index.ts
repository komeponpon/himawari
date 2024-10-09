import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Prisma Clientを使用したデータベース操作の例
app.get('/solar-systems', async (req, res) => {
  const solarSystems = await prisma.solar_system.findMany();
  res.json(solarSystems);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
