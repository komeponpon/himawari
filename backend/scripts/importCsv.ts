import { PrismaClient, Prisma } from '@prisma/client';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';

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
  sll: boolean;
}

interface SolarSystemRow extends CsvRow {
  // 既存のフィールドはそのまま
}

interface BatteryRow {
  id: string;
  lease_company: string;
  lease_period: string;
  battery_manufacturer: string;
  model: string;
  capcity: string;
  quantity: string;
  total_capacity: string;
  installation: boolean;
  monthly_lease_fee: string;
  total_lease_amount: string;
  customer_group: string;
  application_code: string;
}

interface ConstructionCostRow {
  id: string;
  lease_company: string;
  lease_period: string;
  large_category: string;
  small_category: string;
  payment_amount_to_dealer: string;
  monthly_lease_fee: string;
  total_lease_amount: string;
  application_code: string;
}

const prisma = new PrismaClient();

async function importCsv(tableName: string): Promise<void> {
  const results: (SolarSystemRow | BatteryRow | ConstructionCostRow)[] = [];
  const csvPath = path.join(__dirname, `../data/data_${tableName}.csv`);

  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(csvPath);
    const utf8Content = iconv.decode(fileContent, 'Shift_JIS');

    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(utf8Content);

    bufferStream
      .pipe(csv())
      .on('data', (data: SolarSystemRow | BatteryRow | ConstructionCostRow) => results.push(data))
      .on('end', async () => {
        try {
          let result;

          switch (tableName) {
            case 'solar_system':
              const solarData = formatSolarSystemData(results as SolarSystemRow[]);
              result = await prisma.solar_system.createMany({
                data: solarData,
                skipDuplicates: true,
              });
              break;
            case 'batteries':
              const batteryData = formatBatteryData(results as BatteryRow[]);
              result = await prisma.batteries.createMany({
                data: batteryData,
                skipDuplicates: true,
              });
              break;
            case 'construction_costs':
              const constructionData = formatConstructionCostData(results as ConstructionCostRow[]);
              result = await prisma.construction_costs.createMany({
                data: constructionData,
                skipDuplicates: true,
              });
              break;
            default:
              throw new Error('Invalid table name');
          }

          console.log(`${result.count} 件のデータをインポートしました`);
          resolve();
        } catch (error) {
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

function formatSolarSystemData(rows: SolarSystemRow[]) {
  return rows.map(row => ({
    id: parseInt(row.id),
    lease_company: row.lease_company,
    lease_period: row.lease_period,
    module_output: new Prisma.Decimal(row.module_output || 0),
    module_manufacturer: row.module_manufacturer,
    module_model: row.module_model,
    module_count: parseInt(row.module_count),
    pcs_manufacturer: row.pcs_manufacturer,
    pcs_model: row.pcs_model,
    pcs_count: parseInt(row.pcs_count),
    pcs_model2: row.pcs_model2 || null,
    pcs_count2: row.pcs_count2 ? parseInt(row.pcs_count2) : null,
    module_pcs_cable_count: parseInt(row.module_pcs_cable_count),
    bifurcated_count: parseInt(row.bifurcated_count),
    bracket_count: parseInt(row.bracket_count),
    installation: row.installation,
    sll: row.sll,
    total_module_output: new Prisma.Decimal(row.total_module_output || 0),
    application_power_output: new Prisma.Decimal(row.application_power_output || 0),
    region: row.region,
    roof_material: row.roof_material,
    installation_points: row.installation_points,
    monthly_lease_fee_10: row.monthly_lease_fee_10 ? new Prisma.Decimal(row.monthly_lease_fee_10) : null,
    monthly_lease_fee_15: row.monthly_lease_fee_15 ? new Prisma.Decimal(row.monthly_lease_fee_15) : null,
    total_lease_amount: new Prisma.Decimal(row.total_lease_amount || 0),
    customer_group: row.customer_group,
    application_code: row.application_code,
  }));
}

function formatBatteryData(rows: BatteryRow[]) {
  return rows.map(row => ({
    id: parseInt(row.id),
    lease_company: row.lease_company,
    lease_period: row.lease_period,
    battery_manufacturer: row.battery_manufacturer,
    model: row.model,
    capcity: new Prisma.Decimal(row.capcity || 0),
    quantity: Number(row.quantity || 0),
    total_capacity: new Prisma.Decimal(row.total_capacity || 0),
    installation: Number(row.installation) === 1,
    monthly_lease_fee: new Prisma.Decimal(row.monthly_lease_fee || 0),
    total_lease_amount: new Prisma.Decimal(row.total_lease_amount || 0),
    customer_group: row.customer_group,
    application_code: row.application_code,
  }));
}

function formatConstructionCostData(rows: ConstructionCostRow[]) {
  return rows.map(row => ({
    id: parseInt(row.id),
    lease_company: row.lease_company,
    lease_period: row.lease_period,
    large_category: row.large_category,
    small_category: row.small_category,
    payment_amount_to_dealer: new Prisma.Decimal(row.payment_amount_to_dealer || 0),
    monthly_lease_fee: new Prisma.Decimal(row.monthly_lease_fee || 0),
    total_lease_amount: new Prisma.Decimal(row.total_lease_amount || 0),
    application_code: row.application_code,
  }));
}

// メイン処理
async function main() {
  const tables = ['solar_system', 'batteries', 'construction_costs'];
  for (const table of tables) {
    try {
      await importCsv(table);
      console.log(`${table}のインポートが完了しました`);
    } catch (error) {
      console.error(`${table}のインポート中にエラーが発生しました:`, error);
    }
  }
}

main().catch((error) => console.error(error));