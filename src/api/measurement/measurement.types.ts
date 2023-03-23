import { z } from "zod";
// Zod Schemas
const QualitativeBodySchema = z.object({
  measurement_qualitative_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  taxon_measurement_id: z.string(),
  capture_id: z.string().uuid().nullable(),
  mortality_id: z.string().uuid().nullable(),
  qualitative_option_id: z.string().uuid(),
  measurement_comment: z.string().nullable(),
  measured_timestamp: z.coerce.date().nullable(),
});

type QualitativeBody = z.infer<typeof QualitativeBodySchema>;

export { QualitativeBodySchema, QualitativeBody };
