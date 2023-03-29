import {
  measurement_qualitative,
  measurement_quantitative,
} from "@prisma/client";
import { z } from "zod";
import { implement, noAudit, zodAudit, zodID } from "../../utils/zod_helpers";
// Zod Schemas
// Qualitatitive
const QualitativeSchema = implement<measurement_qualitative>().with({
  measurement_qualitative_id: zodID,
  critter_id: zodID,
  taxon_measurement_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  qualitative_option_id: zodID,
  measurement_comment: z.string().nullable(),
  measured_timestamp: z.date().nullable(),
  ...zodAudit,
});

const QualitativeCreateSchema = QualitativeSchema.omit({
  measurement_qualitative_id: true,
  ...noAudit,
})
  .partial({
    capture_id: true,
    mortality_id: true,
    measurement_comment: true,
    measured_timestamp: true,
  })
  .strict();

// Quantitative
const QuantitativeSchema = implement<measurement_quantitative>().with({
  measurement_quantitative_id: zodID,
  critter_id: zodID,
  taxon_measurement_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  value: z.number(),
  measurement_comment: z.string().nullable(),
  measured_timestamp: z.date().nullable(),
  ...zodAudit,
});

const QuantitativeCreateSchema = QuantitativeSchema.omit({
  measurement_quantitative_id: true,
  ...noAudit,
}).partial({
  capture_id: true,
  mortality_id: true,
  measurement_comment: true,
  measured_timestamp: true,
});

type QualitativeBody = z.infer<typeof QualitativeCreateSchema>;
type QuantitativeBody = z.infer<typeof QuantitativeCreateSchema>;

export {
  QualitativeSchema,
  QuantitativeSchema,
  QualitativeBody,
  QuantitativeBody,
};
