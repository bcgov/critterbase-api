import { capture, critter, frequency_unit, measurement_qualitative, measurement_quantitative, Prisma, sex, xref_taxon_measurement_qualitative, xref_taxon_measurement_qualitative_option, xref_taxon_measurement_quantitative } from "@prisma/client";
import { z } from 'zod'
import { commonLocationSelect, FormattedLocation } from "../location/location.types";

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

  const captureSelectSubset = Prisma.validator<Prisma.captureArgs>()({
    select: {
      capture_id: true,
      location_capture_capture_location_idTolocation: {
        ...commonLocationSelect
      },
      location_capture_release_location_idTolocation: {
        ...commonLocationSelect
      },
      capture_timestamp: true,
      release_timestamp: true,
      capture_comment: true,
      release_comment: true
    }
  })

  const mortalitySelectSubset = Prisma.validator<Prisma.mortalityArgs>()({
    select: {
      mortality_id: true,
      location: {
        ...commonLocationSelect
      },
      mortality_timestamp: true,
      mortality_comment: true
    }
  })

  type MeasurementQuantiativeSubsetType = Prisma.measurement_quantitativeGetPayload<typeof measurementQuantitativeIncludeSubset>;
  type MeasurementQualitatitveSubsetType = Prisma.measurement_qualitativeGetPayload<typeof measurementQualitativeIncludeSubset>
  type MarkingSubsetType = Prisma.markingGetPayload<typeof markingIncludeSubset>
  type CaptureSubsetType = Prisma.captureGetPayload<typeof captureSelectSubset>
  type MortalitySubsetType = Prisma.mortalityGetPayload<typeof mortalitySelectSubset>

  const formattedCritterInclude = Prisma.validator<Prisma.critterArgs>()({
    include: {
        lk_taxon: {
          select: { taxon_name_latin: true }
        },
        lk_region_nr: {
          select: { region_nr_name: true }
        },
        capture: captureSelectSubset,
        mortality: mortalitySelectSubset,
        marking: markingIncludeSubset, 
        measurement_qualitative: measurementQualitativeIncludeSubset,
        measurement_quantitative: measurementQuantitativeIncludeSubset
      }
  })
  
 
  type CritterIncludeResult = Prisma.critterGetPayload<typeof formattedCritterInclude>
  interface JoinedMeasurements {
    qualitative: FormattedQualitativeMeasurement[],
    quantitative: FormattedQuantitativeMeasurement[]
  }

  type FormattedCapture = 
    Omit<CaptureSubsetType, 'location_capture_capture_location_idTolocation' | 'location_capture_release_location_idTolocation' | 'lk_region_env' | 'lk_region_nr' | 'lk_wildlife_management_unit'> 
      & {capture_location?: FormattedLocation, release_location?: FormattedLocation}

  type FormattedMortality = 
    Omit<MortalitySubsetType, 'location' | 'lk_region_env' | 'lk_region_nr' | 'lk_wildlife_management_unit'>
      & {mortality_location?: FormattedLocation}
  
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

  type FormattedCritter = critter & {
    measurements: JoinedMeasurements,
    marking: Array<FormattedMarking>,
    taxon_name_latin: string, 
    responsible_region_nr_name: string | undefined,
    lk_taxon?: any,
    lk_region_nr?: any,
    capture: Array<FormattedCapture>,
    mortality: Array<FormattedMortality>
  }

  const CritterUpdateBodySchema = z.object({
    taxon_id: z.string().uuid().optional(),
    wlh_id: z.string().optional().nullable(),
    animal_id: z.string().optional().nullable(),
    sex: z.nativeEnum(sex).optional(),
    responsible_region_nr_id: z.string().uuid().optional().nullable(),
    critter_comment: z.string().optional().nullable()
  })

  const CritterCreateBodySchema = CritterUpdateBodySchema.extend({
    critter_id: z.string().uuid().optional(),
    taxon_id: z.string().uuid(),
    sex: z.nativeEnum(sex)
  })

  type CritterCreate = z.infer<typeof CritterCreateBodySchema>
  type CritterUpdate = z.infer<typeof CritterUpdateBodySchema>

  export type {
    FormattedCritter, 
    MeasurementQualitatitveSubsetType,
    MeasurementQuantiativeSubsetType, 
    MarkingSubsetType, 
    CritterIncludeResult, 
    CaptureSubsetType, 
    MortalitySubsetType,
    FormattedCapture,
    FormattedMortality,
    FormattedMarking,
    FormattedQuantitativeMeasurement,
    FormattedQualitativeMeasurement,
    CritterUpdate,
    CritterCreate
    }
  export {
    measurementQualitativeIncludeSubset, 
    measurementQuantitativeIncludeSubset, 
    markingIncludeSubset, 
    formattedCritterInclude, 
    captureSelectSubset, 
    mortalitySelectSubset,
    CritterCreateBodySchema,
    CritterUpdateBodySchema
  }