/* eslint-disable @typescript-eslint/no-unused-vars */
import { critter, Prisma, sex } from "@prisma/client";
import { array, z } from "zod";
import { AuditColumns, FormatParse } from "../../utils/types";
import {
  implement,
  noAudit,
  ResponseSchema,
  zodID,
} from "../../utils/zod_helpers";
import {
  captureInclude,
  CaptureIncludeSchema,
  CaptureResponseSchema,
  FormattedCapture,
} from "../capture/capture.utils";
import {
  simpleCollectionUnitIncludes,
  SimpleCollectionUnitIncludesSchema,
  SimpleCollectionUnitResponseSchema,
} from "../collectionUnit/collectionUnit.utils";
import {
  FormattedMarking,
  markingIncludes,
  markingResponseSchema,
} from "../marking/marking.utils";
import {
  measurementQualitativeInclude,
  MeasurementQualitativeIncludeSchema,
  measurementQuantitativeInclude,
  MeasurementQuantitativeIncludeSchema,
  QualitativeResponseSchema,
  QuantitativeResponseSchema,
} from "../measurement/measurement.utils";
import {
  FormattedMortality,
  mortalityInclude,
  MortalityIncludeSchema,
  MortalityResponseSchema,
} from "../mortality/mortality.utils";
import { extendZodWithOpenApi } from "zod-openapi";
import { markingIncludesSchema } from "../marking/marking.utils";
import { FamilyParentSchema, FamilyChildSchema } from "../family/family.utils";
extendZodWithOpenApi(z);

// Omit the audit columns from the prisma generated critter type.
type ICritter = Omit<critter, AuditColumns>;

// Base schema for the critter model
const CritterSchema = implement<ICritter>().with({
  critter_id: zodID,
  itis_tsn: z.number(),
  itis_scientific_name: z.string(),
  wlh_id: z.string().nullable(),
  animal_id: z.string().nullable(),
  sex: z.nativeEnum(sex),
  responsible_region_nr_id: zodID.nullable(),
  critter_comment: z.string().nullable(),
});

// Create critter schema
const CritterCreateSchema = CritterSchema.omit({
  critter_id: true,
  itis_scientific_name: true,
}).partial({ itis_tsn: true });

// Update critter schema
const CritterUpdateSchema = CritterCreateSchema.partial();

enum eCritterStatus {
  alive = "alive",
  mortality = "mortality",
}

const detailedCritterInclude = Prisma.validator<Prisma.critterArgs>()({
  include: {
    lk_taxon: {
      select: { taxon_name_latin: true, taxon_name_common: true },
    },
    lk_region_nr: {
      select: { region_nr_name: true },
    },
    critter_collection_unit: simpleCollectionUnitIncludes,
    capture: { ...captureInclude, orderBy: { capture_timestamp: "desc" } },
    mortality: {
      ...mortalityInclude,
      orderBy: { mortality_timestamp: "desc" },
    },
    marking: { ...markingIncludes, orderBy: { attached_timestamp: "desc" } },
    measurement_qualitative: measurementQualitativeInclude,
    measurement_quantitative: measurementQuantitativeInclude,
    family_parent: {
      select: { family_id: true, parent_critter_id: true },
    },
    family_child: {
      select: { family_id: true, child_critter_id: true },
    },
  },
});

type CritterDetailedIncludeResult = Prisma.critterGetPayload<
  typeof detailedCritterInclude
>;

const minimalCritterSelect = Prisma.validator<Prisma.critterArgs>()({
  select: {
    critter_id: true,
    wlh_id: true,
    animal_id: true,
    sex: true,
    lk_taxon: { select: { taxon_name_latin: true, taxon_name_common: true } },
    critter_collection_unit: {
      ...simpleCollectionUnitIncludes,
    },
    mortality: {
      orderBy: {
        mortality_timestamp: "desc",
      },
      select: {
        mortality_timestamp: true,
      },
    },
  },
});

type CritterDefaultIncludeResult = Prisma.critterGetPayload<
  typeof minimalCritterSelect
>;

const CritterCreateEngTaxonSchema = CritterCreateSchema.omit({
  taxon_id: true,
}).extend({
  taxon_name_common: z.string().optional(),
  taxon_name_latin: z.string().optional(),
});

/**
 * Schema for validating a request to fetch multiple critters by their IDs
 */
const CritterIdsRequestSchema = z.object({
  critter_ids: z.array(zodID),
});

const CritterQuerySchema = z.object({ wlh_id: z.string().optional() }); //Add additional properties as needed

const DefaultCritterIncludeSchema =
  implement<CritterDefaultIncludeResult>().with({
    critter_id: zodID,
    wlh_id: z.string().nullable(),
    animal_id: z.string().nullable(),
    sex: z.nativeEnum(sex),
    lk_taxon: z.object({
      taxon_name_latin: z.string(),
      taxon_name_common: z.string().nullable(),
    }),
    critter_collection_unit: SimpleCollectionUnitIncludesSchema.array(),
    mortality: z.object({ mortality_timestamp: z.date() }).array(),
  });

const DetailedCritterIncludeSchema =
  implement<CritterDetailedIncludeResult>().with({
    ...CritterSchema.shape,
    lk_taxon: z.object({
      taxon_name_latin: z.string(),
      taxon_name_common: z.string().nullable(),
    }),
    lk_region_nr: z
      .object({
        region_nr_name: z.string(),
      })
      .nullable(),
    critter_collection_unit: SimpleCollectionUnitIncludesSchema.array(),
    capture: CaptureIncludeSchema.array(),
    mortality: MortalityIncludeSchema.array(),
    marking: markingIncludesSchema.array(),
    measurement_qualitative: MeasurementQualitativeIncludeSchema.array(),
    measurement_quantitative: MeasurementQuantitativeIncludeSchema.array(),
    family_parent: FamilyParentSchema.pick({
      family_id: true,
      parent_critter_id: true,
    }).array(),
    family_child: FamilyChildSchema.pick({
      family_id: true,
      child_critter_id: true,
    }).array(),
  });

const CritterDetailedResponseSchema = ResponseSchema.transform((val) => {
  const {
    mortality,
    capture,
    lk_region_nr,
    lk_taxon,
    marking,
    measurement_qualitative,
    measurement_quantitative,
    critter_collection_unit,
    ...rest
  } = val as CritterDetailedIncludeResult;
  return {
    ...rest,
    taxon: lk_taxon.taxon_name_common ?? lk_taxon.taxon_name_latin,
    responsible_region: lk_region_nr?.region_nr_name,
    mortality_timestamp: mortality[0]?.mortality_timestamp ?? null,
    collection_units: array(SimpleCollectionUnitResponseSchema).parse(
      critter_collection_unit,
    ),
    mortality: mortality.map((a) =>
      stripExtraFields(MortalityResponseSchema.parse(a)),
    ),
    capture: capture.map((a) =>
      stripExtraFields(CaptureResponseSchema.parse(a)),
    ),
    marking: marking.map((a) =>
      stripExtraFields(markingResponseSchema.parse(a)),
    ),
    measurement: {
      qualitative: measurement_qualitative.map((a) =>
        stripExtraFields(QualitativeResponseSchema.parse(a)),
      ),
      quantitative: measurement_quantitative.map((a) =>
        stripExtraFields(QuantitativeResponseSchema.parse(a)),
      ),
    },
  };
});

const CritterDefaultResponseSchema = ResponseSchema.transform((val) => {
  const { critter_collection_unit, lk_taxon, mortality, ...rest } =
    val as CritterDefaultIncludeResult;
  return {
    ...rest,
    taxon: lk_taxon.taxon_name_common ?? lk_taxon.taxon_name_latin,
    collection_units: array(SimpleCollectionUnitResponseSchema).parse(
      critter_collection_unit,
    ),
    mortality_timestamp: mortality[0]?.mortality_timestamp ?? null,
  };
});

const CritterFilterSchema = z.object({
  critter_ids: z
    .object({
      body: z.array(zodID),
      negate: z.boolean(),
    })
    .optional(),
  animal_ids: z
    .object({
      body: z.array(z.string()),
      negate: z.boolean(),
    })
    .optional(),
  wlh_ids: z
    .object({
      body: z.array(z.string()),
      negate: z.boolean(),
    })
    .optional(),
  collection_units: z
    .object({
      body: z.array(zodID),
      negate: z.boolean(),
    })
    .optional(),
  taxon_ids: z
    .object({
      body: z.array(zodID),
      negate: z.boolean(),
    })
    .optional(),
  taxon_name_commons: z
    .object({
      body: z.array(z.string()),
      negate: z.boolean(),
    })
    .optional(),
});

interface critterInterface {
  critter_id?: string;
  create_user?: string;
  update_user?: string;
  create_timestamp?: Date;
  update_timestamp?: Date;
}

const stripExtraFields = <T extends critterInterface>(
  obj: T,
): Omit<T, "critter_id" | keyof AuditColumns> => {
  const {
    critter_id,
    create_user,
    update_user,
    create_timestamp,
    update_timestamp,
    ...rest
  } = obj;
  return rest;
};

type CritterCreate = z.infer<typeof CritterCreateSchema>;
type CritterUpdate = z.infer<typeof CritterUpdateSchema>;
type FormattedCritter = z.infer<typeof CritterDetailedResponseSchema>;
type CritterIdsRequest = z.infer<typeof CritterIdsRequestSchema>;

interface UniqueCritterQuery {
  critter?: Partial<critter> & {
    taxon_name_latin?: string;
    taxon_name_common?: string;
  };
  markings?: Partial<FormattedMarking>[];
  captures?: Partial<FormattedCapture>[];
  mortality?: Partial<FormattedMortality>;
}

const UniqueCritterQuerySchema = implement<UniqueCritterQuery>().with({
  critter: CritterSchema.partial()
    .extend({
      taxon_name_latin: z.string().optional(),
      taxon_name_common: z.string().optional(),
    })
    .optional(),
  markings: z.array(ResponseSchema).optional(),
  captures: z.array(ResponseSchema).optional(),
  mortality: ResponseSchema.optional(),
});

const critterFormats: FormatParse = {
  default: {
    schema: CritterDefaultResponseSchema,
    prismaIncludes: minimalCritterSelect,
  },
  detailed: {
    schema: CritterDetailedResponseSchema,
    prismaIncludes: detailedCritterInclude,
  },
};

export type {
  FormattedCritter,
  CritterDetailedIncludeResult,
  CritterDefaultIncludeResult,
  CritterCreate,
  CritterUpdate,
  CritterIdsRequest,
  UniqueCritterQuery,
};
export {
  eCritterStatus,
  critterFormats,
  detailedCritterInclude,
  minimalCritterSelect,
  CritterDetailedResponseSchema,
  CritterDefaultResponseSchema,
  CritterUpdateSchema,
  CritterCreateSchema,
  CritterIdsRequestSchema,
  CritterQuerySchema,
  CritterFilterSchema,
  UniqueCritterQuerySchema,
  CritterSchema,
  CritterCreateEngTaxonSchema,
  DefaultCritterIncludeSchema,
  DetailedCritterIncludeSchema,
};
