import {
  measurement_qualitative,
  measurement_quantitative,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
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

const QualitativeCreateSchema = implement<
  Omit<
    Prisma.measurement_qualitativeCreateManyInput,
    "measurement_qualitative_id" | keyof AuditColumns
  >
>()
  .with(
    QualitativeSchema.omit({
      measurement_qualitative_id: true,
      ...noAudit,
    })
      .partial()
      .required({
        critter_id: true,
        taxon_measurement_id: true,
        qualitative_option_id: true,
      }).shape
  )
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

const QuantitativeCreateSchema = implement<
  Omit<
    Prisma.measurement_quantitativeCreateManyInput,
    "measurement_quantitative_id" | keyof AuditColumns
  >
>()
  .with(
    QuantitativeSchema.omit({ measurement_quantitative_id: true, ...noAudit })
      .partial()
      .required({
        critter_id: true,
        taxon_measurement_id: true,
        value: true,
      }).shape
  )
  .strict();

type QualitativeBody = z.infer<typeof QualitativeCreateSchema>;
type QuantitativeBody = z.infer<typeof QuantitativeCreateSchema>;

export {
  QualitativeSchema,
  QuantitativeSchema,
  QualitativeBody,
  QuantitativeBody,
};
