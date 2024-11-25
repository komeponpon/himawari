/*
  Warnings:

  - Added the required column `large_category` to the `construction_costs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lease_period` to the `construction_costs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `small_category` to the `construction_costs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "batteries" ADD COLUMN     "installation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "construction_costs" ADD COLUMN     "large_category" VARCHAR(50) NOT NULL,
ADD COLUMN     "lease_period" VARCHAR(50) NOT NULL,
ADD COLUMN     "small_category" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "solar_system" ALTER COLUMN "monthly_lease_fee_10" DROP NOT NULL;
