import { critter, Prisma } from "@prisma/client";

const measurementQuantitativeIncludeSubset = Prisma.validator<Prisma.measurement_quantitativeArgs>()({
    select: {
      xref_taxon_measurement_quantitative: {
        select: {
          measurement_name: true,
        },
      },
      value: true
    }
  }) 
  
  const measurementQualitativeIncludeSubset = Prisma.validator<Prisma.measurement_qualitativeArgs>()({
    select: {
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

  type FormattedCritter = critter & {
    measurement_quantitative: Array<Record<string, any>>,
    measurement_qualitative: Array<Record<string, any>>,
    marking: Array<Record<string, any>>,
    taxon_name_latin: string, 
    responsible_region_nr_name: string | undefined,
    lk_taxon?: any,
    lk_region_nr?: any,
    capture: Array<Record<string, any>>,
    mortality: Array<Record<string, any>>
  }

  export type {FormattedCritter, MeasurementQualitatitveSubsetType, MeasurementQuantiativeSubsetType, MarkingSubsetType, CritterIncludeResult, CaptureSubsetType, MortalitySubsetType}
  export {measurementQualitativeIncludeSubset, measurementQuantitativeIncludeSubset, markingIncludeSubset, formattedCritterInclude, captureSelectSubset, mortalitySelectSubset}