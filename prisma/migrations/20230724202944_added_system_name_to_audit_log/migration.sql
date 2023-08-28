/*
  Warnings:

  - Added the required column `system_name` to the `audit_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audit_log" ADD COLUMN     "system_name" TEXT;
UPDATE "audit_log" SET system_name='not tracked';
ALTER TABLE "audit_log" ALTER COLUMN system_name SET NOT NULL;
