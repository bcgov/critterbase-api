/*
  Warnings:

  - You are about to drop the column `taxon_id` on the `critter` table. All the data in the column will be lost.
  - You are about to drop the column `proximate_predated_by_taxon_id` on the `mortality` table. All the data in the column will be lost.
  - You are about to drop the column `ultimate_predated_by_taxon_id` on the `mortality` table. All the data in the column will be lost.
  - The primary key for the `xref_taxon_collection_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `taxon_id` on the `xref_taxon_collection_category` table. All the data in the column will be lost.
  - You are about to drop the column `taxon_id` on the `xref_taxon_marking_body_location` table. All the data in the column will be lost.
  - You are about to drop the column `taxon_id` on the `xref_taxon_measurement_qualitative` table. All the data in the column will be lost.
  - You are about to drop the column `taxon_id` on the `xref_taxon_measurement_quantitative` table. All the data in the column will be lost.
  - You are about to drop the `lk_taxon` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[itis_tsn,body_location]` on the table `xref_taxon_marking_body_location` will be added. If there are existing duplicate values, this will fail.
  - Made the column `itis_tsn` on table `critter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `proximate_predated_by_itis_tsn` on table `mortality` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ultimate_predated_by_itis_tsn` on table `mortality` required. This step will fail if there are existing NULL values in that column.
  - Made the column `itis_tsn` on table `xref_taxon_collection_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `itis_tsn` on table `xref_taxon_marking_body_location` required. This step will fail if there are existing NULL values in that column.
  - Made the column `itis_tsn` on table `xref_taxon_measurement_quantitative` required. This step will fail if there are existing NULL values in that column.

*/

-- DropMortalityView
DROP VIEW IF EXISTS mortality_v;

-- DropXrefTaxonMeasurementQualitativeView
DROP VIEW IF EXISTS xref_taxon_measurement_qualitative_v;

-- DropXrefTaxonMeasurementEmpiricalView
DROP VIEW IF EXISTS xref_taxon_measurement_empirical_v;

-- DropCaptureView
DROP VIEW IF EXISTS capture_v;

-- DropLKTaxonWLevel
DROP VIEW IF EXISTS lk_taxon_w_level;

-- DropForeignKey
ALTER TABLE "critter" DROP CONSTRAINT "critter_taxon_fk";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "fk_lk_taxon_create_user";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "fk_lk_taxon_update_user";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_class_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_family_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_genus_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_kingdom_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_order_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_phylum_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_species_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "lk_taxon_sub_species_id_fkey";

-- DropForeignKey
ALTER TABLE "mortality" DROP CONSTRAINT "mortality_pcod_taxon_fk";

-- DropForeignKey
ALTER TABLE "mortality" DROP CONSTRAINT "mortality_ucod_taxon_fk";

-- DropForeignKey
ALTER TABLE "xref_taxon_collection_category" DROP CONSTRAINT "xref_taxon_collection_category_taxon_fk";

-- DropForeignKey
ALTER TABLE "xref_taxon_marking_body_location" DROP CONSTRAINT "xref_taxon_marking_location_taxon_id_fkey";

-- DropForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative" DROP CONSTRAINT "fk_xref_taxon_measurement_qualitative_taxon";

-- DropForeignKey
ALTER TABLE "xref_taxon_measurement_quantitative" DROP CONSTRAINT "taxon_measurement_empirical_fk";

-- AlterTable
ALTER TABLE "critter" DROP COLUMN "taxon_id",
ALTER COLUMN "itis_tsn" SET NOT NULL;

-- AlterTable
ALTER TABLE "mortality" DROP COLUMN "proximate_predated_by_taxon_id",
DROP COLUMN "ultimate_predated_by_taxon_id",
ALTER COLUMN "proximate_predated_by_itis_tsn" SET NOT NULL,
ALTER COLUMN "ultimate_predated_by_itis_tsn" SET NOT NULL;

-- AlterTable
ALTER TABLE "xref_taxon_collection_category" DROP CONSTRAINT "xref_taxon_collection_category_pk",
DROP COLUMN "taxon_id",
ALTER COLUMN "collection_category_id" SET DEFAULT crypto.gen_random_uuid(),
ALTER COLUMN "itis_tsn" SET NOT NULL,
ADD CONSTRAINT "xref_taxon_collection_category_pk" PRIMARY KEY ("collection_category_id");

-- AlterTable
ALTER TABLE "xref_taxon_marking_body_location" DROP COLUMN "taxon_id",
ALTER COLUMN "itis_tsn" SET NOT NULL;

-- AlterTable
ALTER TABLE "xref_taxon_measurement_qualitative" DROP COLUMN "taxon_id";

-- AlterTable
ALTER TABLE "xref_taxon_measurement_quantitative" DROP COLUMN "taxon_id",
ALTER COLUMN "itis_tsn" SET NOT NULL;

-- DropTable
DROP TABLE "lk_taxon";

