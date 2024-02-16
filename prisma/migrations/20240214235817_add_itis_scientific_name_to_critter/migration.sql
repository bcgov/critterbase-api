/*
  Warnings:

  - Added the required column `itis_scientific_name` to the `critter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "critter" ADD COLUMN     "itis_scientific_name" TEXT NOT NULL;

-- DropTrigger
DROP TRIGGER IF EXISTS trg_measurement_qualitative_upsert ON measurement_qualitative CASCADE;

DROP TRIGGER IF EXISTS trg_measurement_empirical_tax_upsert ON measurement_quantitative CASCADE;

