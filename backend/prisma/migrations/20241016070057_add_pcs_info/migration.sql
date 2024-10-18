/*
  Warnings:

  - Added the required column `pcs_count2` to the `solar_system` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pcs_model2` to the `solar_system` table without a default value. This is not possible if the table is not empty.
  - Made the column `module_pcs_cable_count` on table `solar_system` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bifurcated_count` on table `solar_system` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bracket_count` on table `solar_system` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "solar_system" ADD COLUMN     "pcs_count2" INTEGER NOT NULL,
ADD COLUMN     "pcs_model2" VARCHAR(50) NOT NULL,
ALTER COLUMN "module_pcs_cable_count" SET NOT NULL,
ALTER COLUMN "bifurcated_count" SET NOT NULL,
ALTER COLUMN "bracket_count" SET NOT NULL;
