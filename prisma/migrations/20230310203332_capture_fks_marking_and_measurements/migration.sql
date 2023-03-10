-- AddForeignKey
ALTER TABLE "marking" ADD CONSTRAINT "marking_capture_id_fkey" FOREIGN KEY ("capture_id") REFERENCES "capture"("capture_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_qualitative" ADD CONSTRAINT "measurement_qualitative_capture_id_fkey" FOREIGN KEY ("capture_id") REFERENCES "capture"("capture_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "measurement_quantitative" ADD CONSTRAINT "measurement_quantitative_capture_id_fkey" FOREIGN KEY ("capture_id") REFERENCES "capture"("capture_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
