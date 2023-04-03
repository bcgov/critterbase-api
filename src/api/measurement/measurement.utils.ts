/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  measurement_qualitative,
  measurement_quantitative,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  nonEmpty,
  ResponseSchema,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";
import {
  getQualMeasurementOrThrow,
  getQuantMeasurementOrThrow,
} from "./measurement.service";
// Zod Schemas

const measurementQualitativeInclude =
  Prisma.validator<Prisma.measurement_qualitativeArgs>()({
    include: {
      xref_taxon_measurement_qualitative: true,
      xref_taxon_measurement_qualitative_option: true,
    },
  });

const measurementQuantitativeInclude =
  Prisma.validator<Prisma.measurement_quantitativeArgs>()({
    include: {
      xref_taxon_measurement_quantitative: true,
    },
  });

// Qualitatitive
/**
 ** Base measurement_qualitatitive schema
 */
const QualitativeSchema = implement<measurement_qualitative>().with({
  measurement_qualitative_id: zodID,
  critter_id: zodID,
  taxon_measurement_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  qualitative_option_id: zodID,
  measurement_comment: z.string().nullable(),
  measured_timestamp: z.coerce.date().nullable(),
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

const QualitativeUpdateSchema = QualitativeCreateSchema.partial().refine(
  nonEmpty,
  "body must include at least one property"
);

const QualitativeResponseSchema = ResponseSchema.transform((val) => {
  const {
    xref_taxon_measurement_qualitative: x,
    xref_taxon_measurement_qualitative_option: y,
    ...rest
  } = val as Prisma.PromiseReturnType<typeof getQualMeasurementOrThrow>;
  return {
    ...rest,
    measurement_name: x?.measurement_name ?? null,
    option_label: y?.option_label ?? null,
    option_value: y?.option_value ?? null,
  };
});

// Quantitative
/**
 ** Base measurement_quantitative schema
 */
const QuantitativeSchema = implement<measurement_quantitative>().with({
  measurement_quantitative_id: zodID,
  critter_id: zodID,
  taxon_measurement_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  value: z.number(),
  measurement_comment: z.string().nullable(),
  measured_timestamp: z.coerce.date().nullable(),
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

const QuantitativeUpdateSchema = QuantitativeCreateSchema.partial().refine(
  nonEmpty,
  "body must include at least one property"
);

const QuantitativeResponseSchema = ResponseSchema.transform((val) => {
  const { xref_taxon_measurement_quantitative: x, ...rest } =
    val as Prisma.PromiseReturnType<typeof getQuantMeasurementOrThrow>;
  return { ...rest, measurement_name: x?.measurement_name ?? null };
});

type QualitativeBody = z.infer<typeof QualitativeCreateSchema>;
type QualitativeUpdateBody = z.infer<typeof QualitativeUpdateSchema>;
type QuantitativeUpdateBody = z.infer<typeof QuantitativeUpdateSchema>;
type QuantitativeBody = z.infer<typeof QuantitativeCreateSchema>;

interface Measurements {
  quantitative: measurement_quantitative[];
  qualitative: measurement_qualitative[];
}

export type {
  Measurements,
  QualitativeBody,
  QualitativeUpdateBody,
  QuantitativeUpdateBody,
  QuantitativeBody,
};
export {
  QualitativeSchema,
  QuantitativeSchema,
  QuantitativeResponseSchema,
  QualitativeResponseSchema,
  measurementQualitativeInclude,
  measurementQuantitativeInclude,
  QualitativeCreateSchema,
  QuantitativeCreateSchema,
  QualitativeUpdateSchema,
  QuantitativeUpdateSchema,
};
