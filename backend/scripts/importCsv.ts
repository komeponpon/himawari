import { PrismaClient, Prisma } from '@prisma/client';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { Stream } from 'stream';

// 型定義の追加
interface CsvRow {
  id: string;
  module_output: string;
  total_module_output: string;
  application_power_output: string;
  module_count: string;
  pcs_model: string;
  pcs_count: string;
  pcs_count2: string;
  module_pcs_cable_count: string;
  bifurcated_count: string;
  bracket_count: string;
  monthly_lease_fee_10: string;
  monthly_lease_fee_15: string | null;
  total_lease_amount: string;
  lease_company: string;
  lease_period: string;
  module_manufacturer: string;
  module_model: string;
  pcs_manufacturer: string;
  pcs_model2: string;
  region: string;
  roof_material: string;
  installation_points: string;
  customer_group: string;
  application_code: string;
  installation: boolean;
}

const prisma = new PrismaClient();

async function importCsv(): Promise<void> {
  const results: CsvRow[] = [];
  const csvPath = path.join(__dirname, '../data/data.csv');

  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(csvPath);
    const utf8Content = iconv.decode(fileContent, 'Shift_JIS');

    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(utf8Content);

    bufferStream
      .pipe(csv())
      .on('data', (data: CsvRow) => results.push(data))
      .on('end', async () => {
        try {
          const formattedData = results.map(row => ({
            id: parseInt(row.id),
            module_output: new Prisma.Decimal(row.module_output || 0),
            total_module_output: new Prisma.Decimal(row.total_module_output || 0),
            application_power_output: new Prisma.Decimal(row.application_power_output || 0),
            module_count: Number(row.module_count || 0),
            pcs_model: row.pcs_model || '',
            pcs_count: Number(row.pcs_count || 0),
            pcs_count2: row.pcs_count2 ? Number(row.pcs_count2) : null,
            module_pcs_cable_count: Number(row.module_pcs_cable_count || 0),
            bifurcated_count: Number(row.bifurcated_count || 0),
            bracket_count: Number(row.bracket_count || 0),
            monthly_lease_fee_10: new Prisma.Decimal(row.monthly_lease_fee_10 || 0),
            monthly_lease_fee_15: row.monthly_lease_fee_15 ? new Prisma.Decimal(row.monthly_lease_fee_15) : null,
            total_lease_amount: new Prisma.Decimal(row.total_lease_amount || 0),
            lease_company: row.lease_company,
            lease_period: row.lease_period,
            module_manufacturer: row.module_manufacturer,
            module_model: row.module_model,
            pcs_manufacturer: row.pcs_manufacturer,
            pcs_model2: row.pcs_model2 || '',
            region: row.region,
            roof_material: row.roof_material,
            installation_points: row.installation_points,
            customer_group: row.customer_group,
            application_code: row.application_code,
            installation: Number(row.installation) === 1,
          }));

          console.log('Importing data...', formattedData[0]);

          const result = await prisma.solar_system.createMany({
            data: formattedData,
            skipDuplicates: true,
          });

          console.log(`${result.count} 件のデータをインポートしました`);
          resolve();
        } catch (error: unknown) {
          console.error('エラーが発生しました:', error);
          reject(error);
        } finally {
          await prisma.$disconnect();
        }
      })
      .on('error', (error: Error) => {
        console.error('CSVの読み込みでエラーが発生しました:', error);
        reject(error);
      });
  });
}

importCsv()
  .catch((error: unknown) => console.error(error));