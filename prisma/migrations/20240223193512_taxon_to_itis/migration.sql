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
  - Added the required column `itis_scientific_name` to the `critter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `critter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `xref_taxon_collection_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `xref_taxon_marking_body_location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `xref_taxon_measurement_quantitative` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "critter" DROP CONSTRAINT IF EXISTS "critter_taxon_fk";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "fk_lk_taxon_create_user";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "fk_lk_taxon_update_user";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_class_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_family_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_genus_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_kingdom_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_order_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_phylum_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_species_id_fkey";

-- DropForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT IF EXISTS "lk_taxon_sub_species_id_fkey";

-- DropForeignKey
ALTER TABLE "mortality" DROP CONSTRAINT IF EXISTS "mortality_pcod_taxon_fk";

-- DropForeignKey
ALTER TABLE "mortality" DROP CONSTRAINT IF EXISTS "mortality_ucod_taxon_fk";

-- DropForeignKey
ALTER TABLE "xref_taxon_collection_category" DROP CONSTRAINT IF EXISTS "xref_taxon_collection_category_taxon_fk";

-- DropForeignKey
ALTER TABLE "xref_taxon_marking_body_location" DROP CONSTRAINT IF EXISTS "xref_taxon_marking_location_taxon_id_fkey";

-- DropForeignKey
ALTER TABLE "xref_taxon_measurement_qualitative" DROP CONSTRAINT IF EXISTS "fk_xref_taxon_measurement_qualitative_taxon";

-- DropForeignKey
ALTER TABLE "xref_taxon_measurement_quantitative" DROP CONSTRAINT IF EXISTS "taxon_measurement_empirical_fk";

-- DropIndex
ALTER TABLE "critter" DROP CONSTRAINT IF EXISTS "critter_un";

-- DropIndex
ALTER TABLE "xref_taxon_marking_body_location" DROP CONSTRAINT IF EXISTS "xref_species_marking_location_un";

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

-- AlterTable
ALTER TABLE "critter" DROP COLUMN IF EXISTS "taxon_id",
ADD COLUMN     IF NOT EXISTS "itis_scientific_name" TEXT NOT NULL,
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER NOT NULL,
ALTER COLUMN "itis_scientific_name" SET DEFAULT "UNKNOWN";

-- AlterTable
ALTER TABLE "mortality" DROP COLUMN IF EXISTS "proximate_predated_by_taxon_id",
DROP COLUMN "ultimate_predated_by_taxon_id",
ADD COLUMN     IF NOT EXISTS "proximate_predated_by_itis_tsn" INTEGER,
ADD COLUMN     IF NOT EXISTS "ultimate_predated_by_itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_collection_category" DROP CONSTRAINT IF EXISTS "xref_taxon_collection_category_pk",
DROP COLUMN IF EXISTS "taxon_id",
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER NOT NULL,
ALTER COLUMN "collection_category_id" SET DEFAULT crypto.gen_random_uuid(),
ADD CONSTRAINT "xref_taxon_collection_category_pk" PRIMARY KEY ("collection_category_id");

-- AlterTable
ALTER TABLE "xref_taxon_marking_body_location" DROP COLUMN IF EXISTS "taxon_id",
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "xref_taxon_measurement_qualitative" DROP COLUMN IF EXISTS "taxon_id",
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "xref_taxon_measurement_quantitative" DROP COLUMN IF EXISTS "taxon_id",
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER NOT NULL;

-- Patch TSN's
-- Animalia
UPDATE critter a                             SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 202423 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';
UPDATE critter a                             SET itis_scientific_name           = 'Animalia' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia';

-- Chordata
UPDATE critter a                             SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';
UPDATE critter a                             SET itis_scientific_name           = 'Chordata' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata';

-- Mammalia
UPDATE critter a                             SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';
UPDATE critter a                             SET itis_scientific_name           = 'Mammalia' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia';

-- Artiodactyla
UPDATE critter a                             SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';
UPDATE critter a                             SET itis_scientific_name           = 'Artiodactyla' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla';

-- Cervidae
UPDATE critter a                             SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';
UPDATE critter a                             SET itis_scientific_name           = 'Cervidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae';

-- Alces
UPDATE critter a                             SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';
UPDATE critter a                             SET itis_scientific_name           = 'Alces' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces';

-- Alces alces
UPDATE critter a                             SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';
UPDATE critter a                             SET itis_scientific_name           = 'Alces alces' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces';

-- Rangifer
UPDATE critter a                             SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';
UPDATE critter a                             SET itis_scientific_name           = 'Rangifer' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer';

-- Rangifer tarandus
UPDATE critter a                             SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus';
UPDATE critter a                             SET itis_scientific_name           = 'Rangifer tarandus' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangier tarandus';

-- Carnivora
UPDATE critter a                             SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';
UPDATE critter a                             SET itis_scientific_name           = 'Carnivora' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora';

-- Canidae
UPDATE critter a                             SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';
UPDATE critter a                             SET itis_scientific_name           = 'Canidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae';

-- Canis
UPDATE critter a                             SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';
UPDATE critter a                             SET itis_scientific_name           = 'Canis' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis';

-- Canis lupus
UPDATE critter a                             SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';
UPDATE critter a                             SET itis_scientific_name           = 'Canis lupus' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus';

-- Ursidae
UPDATE critter a                             SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';
UPDATE critter a                             SET itis_scientific_name           = 'Ursidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae';

-- Ursus
UPDATE critter a                             SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';
UPDATE critter a                             SET itis_scientific_name           = 'Ursus' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus';

-- Usrsus arctos
UPDATE critter a                             SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';
UPDATE critter a                             SET itis_scientific_name           = 'Ursus arctos horriblis' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos';

-- Bovidae
UPDATE critter a                             SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';
UPDATE critter a                             SET itis_scientific_name           = 'Bovidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae';

-- Bison
UPDATE critter a                             SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';
UPDATE critter a                             SET itis_scientific_name           = 'Bison' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison';

-- Bison bison
UPDATE critter a                             SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';
UPDATE xref_taxon_collection_category a      SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';
UPDATE xref_taxon_marking_body_location a    SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';
UPDATE xref_taxon_measurement_qualitative a  SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';
UPDATE xref_taxon_measurement_quantitative a SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';
UPDATE mortality a                           SET proximate_predated_by_itis_tsn = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';
UPDATE mortality a                           SET ultimate_predated_by_itis_tsn  = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';
UPDATE critter a                             SET itis_scientific_name           = 'Bison bison' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison';

-- DropTable
DROP TABLE IF EXISTS "lk_taxon";


-- DropTrigger
DROP TRIGGER IF EXISTS trg_measurement_qualitative_upsert ON measurement_qualitative CASCADE;

DROP TRIGGER IF EXISTS trg_measurement_empirical_tax_upsert ON measurement_quantitative CASCADE;

