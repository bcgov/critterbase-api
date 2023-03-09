/*
  Warnings:

  - You are about to drop the column `previous_version_id` on the `critter` table. All the data in the column will be lost.
  - You are about to drop the `relationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_child_id_fkey";

-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_create_user_fkey";

-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_critter_id_fkey";

-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_sibling_id_fkey";

-- DropForeignKey
ALTER TABLE "relationship" DROP CONSTRAINT "relationship_update_user_fkey";

-- AlterTable
ALTER TABLE "critter" DROP COLUMN "previous_version_id";

-- DropTable
DROP TABLE "relationship";

-- CreateIndex
CREATE INDEX "unit_geom_idx" ON "lk_population_unit_temp" USING GIST ("unit_geom");

-- CreateIndex
CREATE INDEX "region_env_geom_idx" ON "lk_region_env" USING GIST ("region_geom");

-- CreateIndex
CREATE INDEX "region_nr_geom_idx" ON "lk_region_nr" USING GIST ("region_geom");

-- CreateIndex
CREATE INDEX "wmu_geom_idx" ON "lk_wildlife_management_unit" USING GIST ("wmu_geom");

-- RenameForeignKey
ALTER TABLE "capture" DROP CONSTRAINT "capture_cu_fk";
ALTER TABLE "capture" RENAME CONSTRAINT "fk_capture_create_user" TO "capture_cu_fk";

-- RenameForeignKey
ALTER TABLE "capture" DROP CONSTRAINT "capture_uu_fk";
ALTER TABLE "capture" RENAME CONSTRAINT "fk_capture_update_user" TO "capture_uu_fk";

-- RenameForeignKey
ALTER TABLE "lk_colour" DROP CONSTRAINT "fk_lk_colour_create_user";
ALTER TABLE "lk_colour" RENAME CONSTRAINT "lk_colour_created_user_id_fkey" TO "fk_lk_colour_create_user";

-- RenameForeignKey
ALTER TABLE "lk_marking_material" DROP CONSTRAINT "fk_lk_marking_material_create_user";
ALTER TABLE "lk_marking_material" RENAME CONSTRAINT "lk_marking_material_created_user_id_fkey" TO "fk_lk_marking_material_create_user";

-- RenameForeignKey
ALTER TABLE "lk_marking_type" DROP CONSTRAINT "fk_lk_marking_type_create_user";
ALTER TABLE "lk_marking_type" RENAME CONSTRAINT "lk_marking_type_created_user_id_fkey" TO "fk_lk_marking_type_create_user";

-- RenameForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "fk_lk_taxon_create_user";
ALTER TABLE "lk_taxon" RENAME CONSTRAINT "lk_taxon_create_user_fkey" TO "fk_lk_taxon_create_user";

-- RenameForeignKey
ALTER TABLE "lk_taxon" DROP CONSTRAINT "fk_lk_taxon_update_user";
ALTER TABLE "lk_taxon" RENAME CONSTRAINT "lk_taxon_update_user_fkey" TO "fk_lk_taxon_update_user";

-- RenameForeignKey
ALTER TABLE "location" DROP CONSTRAINT "fk_location_update_user";
ALTER TABLE "location" RENAME CONSTRAINT "location_uu_fk_1" TO "fk_location_update_user";

-- RenameForeignKey
ALTER TABLE "location" DROP CONSTRAINT "fk_wmu_id_user";
ALTER TABLE "location" RENAME CONSTRAINT "location_wmu_id_fkey" TO "fk_wmu_id_user";

-- RenameForeignKey
ALTER TABLE "mortality" DROP CONSTRAINT "fk_mortality_create_user";
ALTER TABLE "mortality" RENAME CONSTRAINT "mortality_cu_fk" TO "fk_mortality_create_user";

-- RenameForeignKey
ALTER TABLE "mortality" DROP CONSTRAINT "fk_mortality_update_user";
ALTER TABLE "mortality" RENAME CONSTRAINT "mortality_uu_fk_1" TO "fk_mortality_update_user";
