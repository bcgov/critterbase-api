-- Test values - uncomment to validate success in local environment

-- ALTER TABLE lk_taxon DISABLE TRIGGER ALL;
-- ALTER TABLE "user" DISABLE TRIGGER ALL;
--
-- INSERT INTO "user" (user_id, user_identifier, create_user, update_user)
-- VALUES ('ab341936-201b-455b-9da3-2b837b4b5d65', 'SYSTEM', 'ab341936-201b-455b-9da3-2b837b4b5d65', 'ab341936-201b-455b-9da3-2b837b4b5d65' );
--
--
-- INSERT INTO lk_taxon (taxon_id, kingdom_id, phylum_id, class_id, family_id, genus_id, species_id, taxon_name_latin)
-- VALUES ('cb341936-201b-455b-9da3-2b837b4b5d65', 'cb341936-201b-455b-9da3-2b837b4b5d65', 'cb341936-201b-455b-9da3-2b837b4b5d65', 'cb341936-201b-455b-9da3-2b837b4b5d65', 'cb341936-201b-455b-9da3-2b837b4b5d65', 'cb341936-201b-455b-9da3-2b837b4b5d65','cb341936-201b-455b-9da3-2b837b4b5d65', 'Rangifer');
--
-- INSERT INTO lk_taxon (taxon_id, kingdom_id, phylum_id, class_id, family_id, genus_id, species_id, taxon_name_latin)
-- VALUES ('db341936-201b-455b-9da3-2b837b4b5d65', 'db341936-201b-455b-9da3-2b837b4b5d65', 'db341936-201b-455b-9da3-2b837b4b5d65', 'db341936-201b-455b-9da3-2b837b4b5d65', 'db341936-201b-455b-9da3-2b837b4b5d65', 'db341936-201b-455b-9da3-2b837b4b5d65','db341936-201b-455b-9da3-2b837b4b5d65', 'Alces');
--
-- INSERT INTO lk_taxon (taxon_id, kingdom_id, phylum_id, class_id, family_id, genus_id, species_id, taxon_name_latin)
-- VALUES ('eb341936-201b-455b-9da3-2b837b4b5d65', 'eb341936-201b-455b-9da3-2b837b4b5d65', 'eb341936-201b-455b-9da3-2b837b4b5d65', 'eb341936-201b-455b-9da3-2b837b4b5d65', 'eb341936-201b-455b-9da3-2b837b4b5d65', 'eb341936-201b-455b-9da3-2b837b4b5d65','eb341936-201b-455b-9da3-2b837b4b5d65', 'Ursus');
--
-- INSERT INTO critter (critter_id, sex, taxon_id) VALUES ('fb341936-201b-455b-9da3-2b837b4b5d65', 'Unknown', 'cb341936-201b-455b-9da3-2b837b4b5d65');
-- INSERT INTO critter (sex, taxon_id) VALUES ('Female', 'db341936-201b-455b-9da3-2b837b4b5d65');
-- INSERT INTO critter (sex, taxon_id) VALUES ('Male', 'eb341936-201b-455b-9da3-2b837b4b5d65');
--
-- INSERT INTO lk_cause_of_death (cod_category, cod_reason) VALUES ('test', 'test');
--
-- INSERT INTO mortality (critter_id, mortality_timestamp, proximate_cause_of_death_id) VALUES('fb341936-201b-455b-9da3-2b837b4b5d65', 'now()', (SELECT cod_id FROM lk_cause_of_death LIMIT 1));
-- INSERT INTO mortality (critter_id, mortality_timestamp, proximate_cause_of_death_id, proximate_predated_by_taxon_id) VALUES('fb341936-201b-455b-9da3-2b837b4b5d65', 'now()', (SELECT cod_id FROM lk_cause_of_death LIMIT 1), 'cb341936-201b-455b-9da3-2b837b4b5d65');
--
-- ALTER TABLE lk_taxon ENABLE TRIGGER ALL;
-- ALTER TABLE lk_taxon ENABLE TRIGGER ALL;

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
  - Added the required column `itis_scientific_name` to the `critter` table without  default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `critter` table without  default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `xref_taxon_collection_category` table without  default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `xref_taxon_marking_body_location` table without  default value. This is not possible if the table is not empty.
  - Added the required column `itis_tsn` to the `xref_taxon_measurement_quantitative` table without  default value. This is not possible if the table is not empty.

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
ALTER TABLE "critter"
ADD COLUMN     IF NOT EXISTS "itis_scientific_name" TEXT,
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "mortality"
ADD COLUMN     IF NOT EXISTS "proximate_predated_by_itis_tsn" INTEGER,
ADD COLUMN     IF NOT EXISTS "ultimate_predated_by_itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_collection_category" DROP CONSTRAINT IF EXISTS "xref_taxon_collection_category_pk",
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER,
ALTER COLUMN "collection_category_id" SET DEFAULT crypto.gen_random_uuid(),
ADD CONSTRAINT "xref_taxon_collection_category_pk" PRIMARY KEY ("collection_category_id");

-- AlterTable
ALTER TABLE "xref_taxon_marking_body_location"
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_measurement_qualitative"
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER;

-- AlterTable
ALTER TABLE "xref_taxon_measurement_quantitative"
ADD COLUMN     IF NOT EXISTS "itis_tsn" INTEGER;

-- Patch TSN's
-- Animalia
UPDATE critter                              SET itis_tsn                       = 202423  FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 202423  FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 202423  FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 202423  FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 202423  FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 202423  FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 202423  FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Animalia' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Animalia' AND lk_taxon.taxon_id = critter.taxon_id;

-- Chordata
UPDATE critter                              SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 158852 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Chordata' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Chordata' AND lk_taxon.taxon_id = critter.taxon_id;

-- Mammalia
UPDATE critter                              SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 179913 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Mammalia' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Mammalia' AND lk_taxon.taxon_id = critter.taxon_id;

-- Artiodactyla
UPDATE critter                              SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180692 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Artiodactyla' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Artiodactyla' AND lk_taxon.taxon_id = critter.taxon_id;

-- Cervidae
UPDATE critter                              SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180693 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Cervidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Cervidae' AND lk_taxon.taxon_id = critter.taxon_id;

-- Alces
UPDATE critter                              SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180702 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Alces' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces' AND lk_taxon.taxon_id = critter.taxon_id;

-- Alces alces
UPDATE critter                              SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180703 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Alces alces' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Alces alces' AND lk_taxon.taxon_id = critter.taxon_id;

-- Rangifer
UPDATE critter                              SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180700 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Rangifer' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer' AND lk_taxon.taxon_id = critter.taxon_id;

-- Rangifer tarandus
UPDATE critter                              SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180701 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Rangifer tarandus' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Rangifer tarandus' AND lk_taxon.taxon_id = critter.taxon_id;

-- Carnivora
UPDATE critter                              SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180539 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Carnivora' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Carnivora' AND lk_taxon.taxon_id = critter.taxon_id;

-- Canidae
UPDATE critter                              SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180594 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Canidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canidae' AND lk_taxon.taxon_id = critter.taxon_id;

-- Canis
UPDATE critter                              SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180595 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Canis' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis' AND lk_taxon.taxon_id = critter.taxon_id;

-- Canis lupus
UPDATE critter                              SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180596 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Canis lupus' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Canis lupus' AND lk_taxon.taxon_id = critter.taxon_id;

-- Ursidae
UPDATE critter                              SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180540 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Ursidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursidae' AND lk_taxon.taxon_id = critter.taxon_id;

-- Ursus
UPDATE critter                              SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180541 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Ursus' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus' AND lk_taxon.taxon_id = critter.taxon_id;

-- Usrsus arctos
UPDATE critter                              SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 202385 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Ursus arctos horriblis' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Ursus arctos' AND lk_taxon.taxon_id = critter.taxon_id;

-- Bovidae
UPDATE critter                              SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180704 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Bovidae' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bovidae' AND lk_taxon.taxon_id = critter.taxon_id;

-- Bison
UPDATE critter                              SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180705 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Bison' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison' AND lk_taxon.taxon_id = critter.taxon_id;

-- Bison bison
UPDATE critter                              SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = critter.taxon_id;
UPDATE xref_taxon_collection_category       SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = xref_taxon_collection_category.taxon_id;
UPDATE xref_taxon_marking_body_location     SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = xref_taxon_marking_body_location.taxon_id;
UPDATE xref_taxon_measurement_qualitative   SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = xref_taxon_measurement_qualitative.taxon_id;
UPDATE xref_taxon_measurement_quantitative  SET itis_tsn                       = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = xref_taxon_measurement_quantitative.taxon_id;
UPDATE mortality                            SET proximate_predated_by_itis_tsn = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = mortality.proximate_predated_by_taxon_id;
UPDATE mortality                            SET ultimate_predated_by_itis_tsn  = 180706 FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = mortality.ultimate_predated_by_taxon_id;
UPDATE critter                              SET itis_scientific_name           = 'Bison bison' FROM lk_taxon WHERE lk_taxon.taxon_name_latin = 'Bison bison' AND lk_taxon.taxon_id = critter.taxon_id;


-- DropTable
DROP TABLE IF EXISTS "lk_taxon";

-- AlterTable
ALTER TABLE "critter" DROP COLUMN IF EXISTS "taxon_id";

-- AlterTable
ALTER TABLE "mortality" DROP COLUMN IF EXISTS "proximate_predated_by_taxon_id",
DROP COLUMN IF EXISTS "ultimate_predated_by_taxon_id";

-- AlterTable
ALTER TABLE "xref_taxon_collection_category" DROP CONSTRAINT IF EXISTS "xref_taxon_collection_category_pk",
DROP COLUMN IF EXISTS "taxon_id";

-- AlterTable
ALTER TABLE "xref_taxon_marking_body_location" DROP COLUMN IF EXISTS "taxon_id";

-- AlterTable
ALTER TABLE "xref_taxon_measurement_qualitative" DROP COLUMN IF EXISTS "taxon_id";

-- AlterTable
ALTER TABLE "xref_taxon_measurement_quantitative" DROP COLUMN IF EXISTS "taxon_id";


-- DropTrigger
DROP TRIGGER IF EXISTS trg_measurement_qualitative_upsert ON measurement_qualitative CASCADE;

DROP TRIGGER IF EXISTS trg_measurement_empirical_tax_upsert ON measurement_quantitative CASCADE;

-- AlterTable
ALTER TABLE "critter" ALTER COLUMN "itis_scientific_name" SET NOT NULL;
ALTER TABLE "critter" ALTER COLUMN "itis_tsn" SET NOT NULL;
ALTER TABLE "xref_taxon_collection_category" ALTER COLUMN "itis_tsn" SET NOT NULL;
ALTER TABLE "xref_taxon_marking_body_location" ALTER COLUMN "itis_tsn" SET NOT NULL;
ALTER TABLE "xref_taxon_measurement_qualitative" ALTER COLUMN "itis_tsn" SET NOT NULL;
ALTER TABLE "xref_taxon_measurement_quantitative" ALTER COLUMN "itis_tsn" SET NOT NULL;

