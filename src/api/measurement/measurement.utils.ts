/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  measurement_qualitative,
  measurement_quantitative,
  measurement_unit,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  DeleteSchema,
  implement,
  noAudit,
  ResponseSchema,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";
import {
  getQualMeasurementOrThrow,
  getQuantMeasurementOrThrow,
} from "./measurement.service";
// Zod Schemas

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

type MeasurementQualitativeInclude = Prisma.measurement_qualitativeGetPayload<typeof measurementQualitativeInclude>;
const MeasurementQualitativeIncludeSchema = implement<MeasurementQualitativeInclude>().with({
  ...QualitativeSchema.shape,
  xref_taxon_measurement_qualitative: z.object({
    taxon_measurement_id: zodID,
    taxon_id: zodID,
    measurement_name: z.string(),
    measurement_desc: z.string().nullable(),        
    ...zodAudit
  }),
  xref_taxon_measurement_qualitative_option: z.object({
    qualitative_option_id: zodID,
    taxon_measurement_id: zodID,
    option_label: z.string().nullable(),
    option_value: z.number(),
    option_desc: z.string().nullable(),
    ...zodAudit
  })
})

type MeasurementQuantitativeInclude = Prisma.measurement_quantitativeGetPayload<typeof measurementQuantitativeInclude>;
const MeasurementQuantitativeIncludeSchema = implement<MeasurementQuantitativeInclude>().with({
  ...QuantitativeSchema.shape,
  xref_taxon_measurement_quantitative: z.object({
    taxon_measurement_id: zodID,
    taxon_id: zodID,
    measurement_name: z.string(),
    measurement_desc: z.string().nullable(),
    min_value: z.number().nullable(),
    max_value: z.number().nullable(),
    unit: z.nativeEnum(measurement_unit).nullable(),
    ...zodAudit
  })
})

// Qualitatitive


const QualitativeCreateSchema = implement<
  Omit<
    Prisma.measurement_qualitativeCreateManyInput,
    keyof AuditColumns
  >
>()
  .with(
    QualitativeSchema.omit({
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

const QualitativeUpdateSchema = QualitativeCreateSchema.partial();

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


const QuantitativeCreateSchema = implement<
  Omit<
    Prisma.measurement_quantitativeCreateManyInput,
    keyof AuditColumns
  >
>()
  .with(
    QuantitativeSchema.omit({ ...noAudit })
      .partial()
      .required({
        critter_id: true,
        taxon_measurement_id: true,
        value: true,
      }).shape
  )
  .strict();

const QuantitativeUpdateSchema = QuantitativeCreateSchema.partial();

const QuantitativeVerificationSchema = QuantitativeSchema.partial().required({measurement_quantitative_id: true, taxon_measurement_id: true});
const QualitatitiveVerificationSchema = QualitativeSchema.partial().required({measurement_qualitative_id: true, taxon_measurement_id: true})
const MeasurementVerificationSchema = z.object({
  taxon_id: zodID,
  quantitative: z.array(QuantitativeVerificationSchema),
  qualitative: z.array(QualitatitiveVerificationSchema)
})

const QuantitativeResponseSchema = ResponseSchema.transform((val) => {
  const { xref_taxon_measurement_quantitative: x, ...rest } =
    val as Prisma.PromiseReturnType<typeof getQuantMeasurementOrThrow>;
  return { ...rest, measurement_name: x?.measurement_name ?? null };
});

const QualitativeDeleteSchema = QualitativeSchema.pick({ measurement_qualitative_id: true}).extend(DeleteSchema.shape);
const QuantitativeDeleteSchema = QuantitativeSchema.pick({ measurement_quantitative_id: true}).extend(DeleteSchema.shape);

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
  QuantitativeVerificationSchema,
  QualitatitiveVerificationSchema,
  MeasurementVerificationSchema,
  MeasurementQualitativeIncludeSchema,
  MeasurementQuantitativeIncludeSchema,
  QualitativeDeleteSchema,
  QuantitativeDeleteSchema
};
