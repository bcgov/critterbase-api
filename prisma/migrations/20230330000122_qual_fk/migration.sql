-- AddForeignKey
ALTER TABLE "measurement_qualitative" ADD CONSTRAINT "fk_measurement_qualitative_xref_measurement" FOREIGN KEY ("taxon_measurement_id") REFERENCES "xref_taxon_measurement_qualitative"("taxon_measurement_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
