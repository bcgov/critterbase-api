import { z } from "zod";
// Zod Schemas
const QualitativeBodySchema = z.object({
  critter_id: z.string().uuid(),
  taxon_measurement_id: z.string(),
  capture_id: z.string().uuid().nullable().optional(),
  mortality_id: z.string().uuid().nullable().optional(),
  qualitative_option_id: z.string().uuid(),
  measurement_comment: z.string().nullable().optional(),
  measured_timestamp: z.coerce.date().nullable().optional(),
});

type QualitativeBody = z.infer<typeof QualitativeBodySchema>;

export { QualitativeBodySchema, QualitativeBody };
