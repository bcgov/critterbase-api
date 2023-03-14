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
    lk_region_nr?: any
  }

  export type {FormattedCritter, MeasurementQualitatitveSubsetType, MeasurementQuantiativeSubsetType, MarkingSubsetType, CritterIncludeResult}
  export {measurementQualitativeIncludeSubset, measurementQuantitativeIncludeSubset, markingIncludeSubset, formattedCritterInclude}