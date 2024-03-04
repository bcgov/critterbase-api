-- AlterTable
ALTER TABLE "artifact" ADD COLUMN     "event_id" UUID;

-- AlterTable
ALTER TABLE "capture" ADD COLUMN     "event_id" UUID;

-- AlterTable
ALTER TABLE "critter_collection_unit" ADD COLUMN     "event_id" UUID;

-- AlterTable
ALTER TABLE "family" ADD COLUMN     "event_id" UUID;

-- AlterTable
ALTER TABLE "marking" ADD COLUMN     "event_id" UUID;

-- AlterTable
ALTER TABLE "measurement_qualitative" ADD COLUMN     "event_id" UUID;

-- AlterTable
ALTER TABLE "measurement_quantitative" ADD COLUMN     "event_id" UUID;

-- AlterTable
ALTER TABLE "mortality" ADD COLUMN     "event_id" UUID;

-- CreateTable
CREATE TABLE "event_group" (
    "event_group_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "source_system" TEXT NOT NULL,

    CONSTRAINT "event_group_pkey" PRIMARY KEY ("event_group_id")
);

-- CreateTable
CREATE TABLE "event" (
    "event_id" UUID NOT NULL DEFAULT crypto.gen_random_uuid(),
    "event_group_id" UUID,
    "itis_tsn" INTEGER NOT NULL,
    "critter_id" UUID,

    CONSTRAINT "event_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_group_event_group_id_key" ON "event_group"("event_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_event_id_key" ON "event"("event_id");

-- AddForeignKey
ALTER TABLE "artifact" ADD CONSTRAINT "artifact_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capture" ADD CONSTRAINT "capture_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critter_collection_unit" ADD CONSTRAINT "critter_collection_unit_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "family_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_qualitative" ADD CONSTRAINT "measurement_qualitative_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_quantitative" ADD CONSTRAINT "measurement_quantitative_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mortality" ADD CONSTRAINT "mortality_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_critter_id_fkey" FOREIGN KEY ("critter_id") REFERENCES "critter"("critter_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_event_group_id_fkey" FOREIGN KEY ("event_group_id") REFERENCES "event_group"("event_group_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Create a function to enforce constrain that an event can have a (critter_id) OR (itis_tsn && event_group_id) not both
CREATE OR REPLACE FUNCTION enforce_event_constraint()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.critter_id IS NOT NULL AND (NEW.itis_tsn IS NOT NULL AND NEW.event_group_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Either critter_id must be set or both itis_tsn and event_group_id must be set, but not both';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_constraint_trigger
BEFORE INSERT OR UPDATE ON event
FOR EACH ROW
EXECUTE FUNCTION enforce_event_constraint();