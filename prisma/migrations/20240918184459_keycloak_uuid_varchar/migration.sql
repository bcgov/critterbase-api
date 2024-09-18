/*
  Warnings:

  - The `capture_time` column on the `capture` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `release_time` column on the `capture` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "capture" DROP COLUMN "capture_time",
ADD COLUMN     "capture_time" TIME(0),
DROP COLUMN "release_time",
ADD COLUMN     "release_time" TIME(0);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "keycloak_uuid" SET DATA TYPE VARCHAR(36);

-- UpdateTable
UPDATE "user"
SET "keycloak_uuid" = TRIM(TRAILING ' ' FROM keycloak_uuid)
WHERE keycloak_uuid IS NOT NULL;
