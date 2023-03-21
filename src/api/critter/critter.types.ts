import { capture, critter, frequency_unit, measurement_qualitative, measurement_quantitative, Prisma, xref_taxon_measurement_qualitative, xref_taxon_measurement_qualitative_option, xref_taxon_measurement_quantitative } from "@prisma/client";

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
        select: {
          latitude: true,
          longitude: true,
          lk_region_env: {
            select: {
              region_env_name: true
            }
          },
          lk_region_nr: {
            select: {
              region_nr_name: true
            }
          },
          lk_wildlife_management_unit: {
            select: {
              wmu_name: true
            }
          }
        }
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
        select: {
          latitude: true,
          longitude: true,
          lk_region_env: {
            select: {
              region_env_name: true
            }
          },
          lk_region_nr: {
            select: {
              region_nr_name: true
            }
          },
          lk_wildlife_management_unit: {
            select: {
              wmu_name: true
            }
          }
        }
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
    Omit<CaptureSubsetType, 'location_capture_caputre_location_idTolocation' | 'lk_region_env' | 'lk_region_nr' | 'lk_wildlife_management_unit'> 
      & {region_env_name?: string | undefined, region_nr_name?: string | undefined, wmu_name?: string | undefined}

  type FormattedMortality = 
    Omit<MortalitySubsetType, 'location' | 'lk_region_env' | 'lk_region_nr' | 'lk_wildlife_management_unit'>
      & {region_env_name?: string | undefined, region_nr_name?: string | undefined, wmu_name?: string | undefined}
  
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
    //measurement_quantitative: Array<Record<string, any>>,
   // measurement_qualitative: Array<Record<string, any>>,
    measurements: JoinedMeasurements,
    marking: Array<FormattedMarking>,
    taxon_name_latin: string, 
    responsible_region_nr_name: string | undefined,
    lk_taxon?: any,
    lk_region_nr?: any,
    capture: Array<FormattedCapture>,
    mortality: Array<FormattedMortality>
  }

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
    FormattedQualitativeMeasurement
    }
  export {
    measurementQualitativeIncludeSubset, 
    measurementQuantitativeIncludeSubset, 
    markingIncludeSubset, 
    formattedCritterInclude, 
    captureSelectSubset, 
    mortalitySelectSubset
  }