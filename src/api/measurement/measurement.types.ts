import { z } from "zod";
// Zod Schemas
const QualitativeBodySchema = z.object({
  critter_id: z.string().uuid(),
  taxon_measurement_id: z.string().uuid(),
  capture_id: z.string().nullable().optional(),
  moratlity_id: z.string().nullable().optional(),
  qualitative_option_id: z.string(),
  measurement_comment: z.string().optional(),
  measured_timestamp: z.coerce.date(),
});

type QualitativeBody = z.infer<typeof QualitativeBodySchema>;

export { QualitativeBodySchema, QualitativeBody };
