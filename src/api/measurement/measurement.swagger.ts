import { z } from "zod"
import { MeasurementQualitativeIncludeSchema, MeasurementQuantitativeIncludeSchema } from "./measurement.utils"

export const SwaggerQualitativeResponseValidationSchema = MeasurementQualitativeIncludeSchema.omit({
    xref_taxon_measurement_qualitative: true,
    xref_taxon_measurement_qualitative_option: true
  }).extend({
    measurement_name: z.string().nullable(),
    option_label: z.string().nullable(),
    option_value: z.number().nullable()
  })

export const SwaggerQuantitativeResponseValidationSchema = MeasurementQuantitativeIncludeSchema.omit({
    xref_taxon_measurement_quantitative: true
  }).extend({
    measurement_name: z.string().nullable()
  })