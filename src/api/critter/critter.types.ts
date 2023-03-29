import { capture, critter, frequency_unit, measurement_qualitative, measurement_quantitative, measurement_unit, Prisma, sex, xref_taxon_measurement_qualitative, xref_taxon_measurement_qualitative_option, xref_taxon_measurement_quantitative } from "@prisma/client";
import { z, ZodAny } from 'zod'
import { implement, noAudit, zodID } from "../../utils/zod_helpers";
import { captureInclude, CaptureResponseFormattedSchema, CaptureResponseSchema } from "../capture/capture.types";
import { commonLocationSelect, FormattedLocation } from "../location/location.types";
import { mortalityInclude, MortalityResponseFormattedSchema, MortalityResponseSchema } from "../mortality/mortality.types";

const measurementQuantitativeIncludeSubset = Prisma.validator<Prisma.measurement_quantitativeArgs>()({
    select: {
      xref_taxon_measurement_quantitative: {
        select: {
          measurement_name: true,
          unit: true
        },
      },
      measured_timestamp: true,
      value: true
    }
  }) 
  
  const measurementQualitativeIncludeSubset = Prisma.validator<Prisma.measurement_qualitativeArgs>()({
    select: {
      measured_timestamp: true,
      xref_taxon_measurement_qualitative_option: {
        select: {
          option_label: true,
          xref_taxon_measurement_qualitative: {
            select: {
              measurement_name: true
            }
          }
        }
      }
    }
  }) 
  
  const markingIncludeSubset = Prisma.validator<Prisma.markingArgs>()({
    select: {
      lk_colour_marking_primary_colour_idTolk_colour: {
        select: {
          colour: true
        }
      },
      lk_colour_marking_secondary_colour_idTolk_colour: {
        select: {
          colour: true
        }
      },
      lk_marking_type: {
        select: {
          name: true
        }
      },
      lk_marking_material: {
        select: {
          material: true
        }
      },
      xref_taxon_marking_body_location: {
        select: {
          body_location: true
        }
      },
      identifier: true,
      frequency: true, 
      frequency_unit: true,
      order: true
    }
  })

  type MeasurementQuantiativeSubsetType = Prisma.measurement_quantitativeGetPayload<typeof measurementQuantitativeIncludeSubset>;
  type MeasurementQualitatitveSubsetType = Prisma.measurement_qualitativeGetPayload<typeof measurementQualitativeIncludeSubset>
  type MarkingSubsetType = Prisma.markingGetPayload<typeof markingIncludeSubset>

  const formattedCritterInclude = Prisma.validator<Prisma.critterArgs>()({
    include: {
        lk_taxon: {
          select: { taxon_name_latin: true }
        },
        lk_region_nr: {
          select: { region_nr_name: true }
        },
        capture: captureInclude,
        mortality: mortalityInclude,
        marking: markingIncludeSubset, 
        measurement_qualitative: measurementQualitativeIncludeSubset,
        measurement_quantitative: measurementQuantitativeIncludeSubset
      }
  })
  
 
  type CritterIncludeResult = Prisma.critterGetPayload<typeof formattedCritterInclude>
  
  type FormattedQuantitativeMeasurement = 
    Pick<measurement_quantitative, 'measured_timestamp' | 'value'> 
    & Pick<xref_taxon_measurement_quantitative, 'measurement_name' | 'unit'>

  type FormattedQualitativeMeasurement = 
    Pick<measurement_qualitative, 'measured_timestamp'> 
    & Pick<xref_taxon_measurement_qualitative, 'measurement_name'> 
    & { value: string | null}

  type FormattedMarking = {
    primary_colour: string | null,
    secondary_colour: string | null,
    marking_type: string | null,
    marking_material: string | null, 
    body_location: string | null, 
    identifier: string | null,
    frequency: number | null,
    frequency_unit: frequency_unit | null,
    order: number | null
  }

  const CritterSchema = implement<critter>().with({
    critter_id: zodID,
    taxon_id: zodID,
    wlh_id: z.string().nullable(),
    animal_id: z.string().nullable(),
    sex: z.nativeEnum(sex),
    responsible_region_nr_id: zodID.nullable(),
    critter_comment: z.string().nullable(),
    create_user: zodID,
    update_user: zodID,
    create_timestamp: z.coerce.date(),
    update_timestamp: z.coerce.date()
  })

  const CritterUpdateSchema = CritterSchema.omit({
    critter_id: true,
    ...noAudit,
  }).partial();

  const CritterCreateSchema = CritterUpdateSchema.required({
    taxon_id: true,
    sex: true
  })

  const CritterResponseSchema = implement<CritterIncludeResult>().with({
    critter_id: zodID,
    taxon_id: zodID,
    wlh_id: z.string().nullable(),
    animal_id: z.string().nullable(),
    sex: z.nativeEnum(sex),
    responsible_region_nr_id: zodID.nullable(),
    critter_comment: z.string().nullable(),
    create_user: zodID,
    update_user: zodID,
    create_timestamp: z.coerce.date(),
    update_timestamp: z.coerce.date(),
    lk_region_nr: z.object({ region_nr_name: z.string() }).nullable(),
    mortality: MortalityResponseSchema.array(),
    capture: CaptureResponseSchema.array(),
    lk_taxon: z.object({ taxon_name_latin: z.string() }),
    measurement_quantitative: z.array(z.object({
      measured_timestamp: z.coerce.date(),
      xref_taxon_measurement_quantitative: z.object({
        measurement_name: z.string(),
        unit: z.nativeEnum(measurement_unit).nullable()
      }),
      value: z.number()
    })),
    measurement_qualitative: z.array(z.object({
      measured_timestamp: z.coerce.date(),
      xref_taxon_measurement_qualitative_option: z.object({
        option_label: z.string(),
        xref_taxon_measurement_qualitative: z.object({
          measurement_name: z.string()
        })
      })
    })),
    marking: z.any()
  }).transform((val) => {
    const {
      mortality,
      capture,
      lk_region_nr,
      lk_taxon,
      ...rest} = val;
    return {
      ...rest,
      taxon_name_latin: lk_taxon.taxon_name_latin,
      responsible_region_name: lk_region_nr?.region_nr_name,
      mortality: mortality.map(a => MortalityResponseFormattedSchema.parse(a)),
      capture: capture.map(a => CaptureResponseFormattedSchema.parse(a))
    }
  })

  type CritterCreate = z.infer<typeof CritterCreateSchema>
  type CritterUpdate = z.infer<typeof CritterUpdateSchema>
  type FormattedCritter = z.infer<typeof CritterResponseSchema>

  export type {
    FormattedCritter, 
    MeasurementQualitatitveSubsetType,
    MeasurementQuantiativeSubsetType, 
    MarkingSubsetType, 
    CritterIncludeResult, 
    FormattedMarking,
    FormattedQuantitativeMeasurement,
    FormattedQualitativeMeasurement,
    CritterCreate,
    CritterUpdate
    }
  export {
    measurementQualitativeIncludeSubset, 
    measurementQuantitativeIncludeSubset, 
    markingIncludeSubset, 
    formattedCritterInclude, 
    CritterResponseSchema,
    CritterUpdateSchema,
    CritterCreateSchema
  }