-- AlterTable
ALTER TABLE "user" ALTER COLUMN "keycloak_uuid" SET DATA TYPE VARCHAR(36);

-- UpdateTable
UPDATE "user"
SET "keycloak_uuid" = TRIM(TRAILING ' ' FROM keycloak_uuid)
WHERE keycloak_uuid IS NOT NULL;
