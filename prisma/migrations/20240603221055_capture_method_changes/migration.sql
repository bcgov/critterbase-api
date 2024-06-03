/*
  Warnings:

  - You are about to drop the column `capture_timestamp` on the `capture` table. All the data in the column will be lost.
  - Added the required column `capture_date` to the `capture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "capture"
ADD COLUMN     "capture_date" DATE NOT NULL,
ADD COLUMN     "capture_method_id" UUID,
ADD COLUMN     "capture_time" TIME;

-- UpdateCaptureTable
UPDATE "capture"
SET
  capture_date = capture_timestamp::date,
  capture_time = capture_timestamp::time;

-- DropTimestamp
ALTER TABLE "capture" DROP COLUMN "capture_timestamp";

-- AlterTable
ALTER TABLE "measurement_quantitative" ADD COLUMN     "lk_capture_methodTaxon_measurement_id" UUID;

-- CreateTable
CREATE TABLE "lk_capture_method" (
    "capture_method_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "create_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "update_user" UUID NOT NULL DEFAULT getuserid('SYSTEM'::text),
    "create_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUser_id" UUID,

    CONSTRAINT "capture_method_empirical_pk" PRIMARY KEY ("capture_method_id")
);

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_capture_method_id_fkey" FOREIGN KEY ("capture_method_id") REFERENCES "lk_capture_method"("capture_method_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lk_capture_method" ADD CONSTRAINT "lk_capture_method_userUser_id_fkey" FOREIGN KEY ("userUser_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddReferenceValues
INSERT INTO "lk_capture_method" (name, description)
VALUES 
  ('Net Gun', 'Captured with a Net Gun'),
  ('Snare', 'Captured with a Snare');
