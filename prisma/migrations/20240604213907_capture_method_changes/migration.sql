/*
  Warnings:

  - You are about to drop the column `capture_timestamp` on the `capture` table. All the data in the column will be lost.
  - You are about to drop the column `release_timestamp` on the `capture` table. All the data in the column will be lost.
  - Added the required column `capture_date` to the `capture` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "capture" DROP CONSTRAINT "capture_cap_location_fk";

-- DropForeignKey
ALTER TABLE "capture" DROP CONSTRAINT "capture_rel_location_fk";

-- AlterTable
ALTER TABLE "capture"
ADD COLUMN     "capture_method_id" UUID,
ADD COLUMN     "capture_date" DATE,
ADD COLUMN     "capture_time" TIME,
ADD COLUMN     "release_date" DATE,
ADD COLUMN     "release_time" TIME;

-- UpdateCaptureTable
UPDATE "capture"
SET
  capture_date = capture_timestamp::date,
  capture_time = capture_timestamp::time,
  release_date = release_timestamp::date,
  release_time = release_timestamp::time;

ALTER TABLE "capture"
DROP COLUMN "capture_timestamp",
DROP COLUMN "release_timestamp",
ALTER COLUMN "capture_date" SET NOT NULL;

-- CreateTable
CREATE TABLE "lk_capture_method" (
    "capture_method_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "method_name" TEXT NOT NULL,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lk_capture_method_pk" PRIMARY KEY ("capture_method_id")
);

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_cap_location_fk" FOREIGN KEY ("capture_location_id") REFERENCES "location"("location_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_rel_location_fk" FOREIGN KEY ("release_location_id") REFERENCES "location"("location_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_capture_method_id_fkey" FOREIGN KEY ("capture_method_id") REFERENCES "lk_capture_method"("capture_method_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lk_capture_method" ADD CONSTRAINT "lk_capture_method_create_user_fkey" FOREIGN KEY ("create_user") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lk_capture_method" ADD CONSTRAINT "lk_capture_method_update_user_fkey" FOREIGN KEY ("update_user") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddReferenceValues
INSERT INTO "lk_capture_method" (method_name, description)
VALUES
  ('Net Gun', 'Captured with a Net Gun'),
  ('Snare', 'Captured with a Snare');
