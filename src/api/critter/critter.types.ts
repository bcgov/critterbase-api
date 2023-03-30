import { critter, Prisma, sex } from "@prisma/client";
import { string, z } from 'zod'
import { AuditColumns } from "../../utils/types";
import { implement, noAudit, zodID } from "../../utils/zod_helpers";
import { captureInclude, CaptureResponseSchema } from "../capture/capture.types";
import { markingIncludes, markingResponseSchema } from "../marking/marking.types";
import { mortalityInclude, MortalityResponseSchema } from "../mortality/mortality.types";
import { measurementQualitativeInclude, measurementQuantitativeInclude, QualitativeResponseSchema, QuantitativeResponseSchema } from "../measurement/measurement.utils";

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
        marking: markingIncludes, 
        measurement_qualitative: measurementQualitativeInclude,
        measurement_quantitative: measurementQuantitativeInclude
      }
  })
  
 
  type CritterIncludeResult = Prisma.critterGetPayload<typeof formattedCritterInclude>


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

  const CritterUpdateSchema = implement<
   Omit<Prisma.critterUncheckedUpdateManyInput, "critter_id" | keyof AuditColumns>
  >().with(CritterSchema.omit({
    critter_id: true,
    ...noAudit,
  }).partial().shape);

  const CritterCreateSchema = implement<
   Omit<Prisma.critterCreateManyInput, "critter_id" | keyof AuditColumns>>()
  .with(CritterUpdateSchema.required({
    taxon_id: true,
    sex: true
  }).shape);

  /*const CritterResponseSchema = implement<CritterIncludeResult>().with({
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
    marking: markingIncludesSchema.array()*/
const CritterResponseSchema = z.object({}).passthrough()
.transform((val) => {
    const {
      mortality,
      capture,
      lk_region_nr,
      lk_taxon,
      marking,
      measurement_qualitative,
      measurement_quantitative,
      ...rest} = val as CritterIncludeResult;
    return {
      ...rest,
      taxon_name_latin: lk_taxon.taxon_name_latin,
      responsible_region_name: lk_region_nr?.region_nr_name,
      mortality: mortality.map(a => stripCritterId(MortalityResponseSchema.parse(a))),
      capture: capture.map(a => stripCritterId(CaptureResponseSchema.parse(a))),
      marking: marking.map(a => stripCritterId(markingResponseSchema.parse(a)) ),
      measurement: {
        qualitative: measurement_qualitative.map(a => stripCritterId(QualitativeResponseSchema.parse(a))),
        quantitative: measurement_quantitative.map(a => stripCritterId(QuantitativeResponseSchema.parse(a)))
      }
    }
  });

  interface critterInterface {
    critter_id?: string,
    create_user?: string
    update_user?: string,
    create_timestamp?: Date,
    update_timestamp?: Date
  }
  
  const stripCritterId = <T extends critterInterface>(obj: T): 
      Omit<T, "critter_id" | keyof AuditColumns > => {
    const { critter_id, create_user, update_user, create_timestamp, update_timestamp, ...rest} = obj;
    return rest;
  }

  type CritterCreate = z.infer<typeof CritterCreateSchema>
  type CritterUpdate = z.infer<typeof CritterUpdateSchema>
  type FormattedCritter = z.infer<typeof CritterResponseSchema>

  export type {
    FormattedCritter,  
    CritterIncludeResult,
    CritterCreate,
    CritterUpdate
    }
  export {
    measurementQualitativeIncludeSubset, 
    measurementQuantitativeIncludeSubset, 
    formattedCritterInclude, 
    CritterResponseSchema,
    CritterUpdateSchema,
    CritterCreateSchema
  }