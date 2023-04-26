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
  CaptureResponseSchema,
} from "../capture/capture.utils";
import {
  simpleCollectionUnitIncludes,
  SimpleCollectionUnitResponseSchema,
} from "../collectionUnit/collectionUnit.utils";
import {
  markingIncludes,
  markingResponseSchema,
} from "../marking/marking.utils";
import {
  measurementQualitativeInclude,
  measurementQuantitativeInclude,
  QualitativeResponseSchema,
  QuantitativeResponseSchema,
} from "../measurement/measurement.utils";
import {
  mortalityInclude,
  MortalityResponseSchema,
} from "../mortality/mortality.utils";

const eCritterStatus = {
  alive: "Alive",
  mortality: "Mortality",
};

const detailedCritterInclude = Prisma.validator<Prisma.critterArgs>()({
  include: {
    lk_taxon: {
      select: { taxon_name_latin: true, taxon_name_common: true },
    },
    lk_region_nr: {
      select: { region_nr_name: true },
    },
    user_critter_create_userTouser: {
      select: { system_name: true },
    },
    critter_collection_unit: simpleCollectionUnitIncludes,
    capture: captureInclude,
    mortality: mortalityInclude,
    marking: markingIncludes,
    measurement_qualitative: measurementQualitativeInclude,
    measurement_quantitative: measurementQuantitativeInclude,
  },
});

type CritterIncludeResult = Prisma.critterGetPayload<
  typeof detailedCritterInclude
>;

const defaultCritterInclude = Prisma.validator<Prisma.critterArgs>()({
  include: {
    lk_taxon: { select: { taxon_name_latin: true, taxon_name_common: true } },
    critter_collection_unit: {
      select: simpleCollectionUnitIncludes.include,
    },
    mortality: {
      select: {
        mortality_timestamp: true,
      },
    },
  },
});

const minimalCritterSelect = Prisma.validator<Prisma.critterArgs>()({
  select: {
    critter_id: true,
    wlh_id: true,
    animal_id: true,
    sex: true,
    ...defaultCritterInclude.include,
  },
});

type CritterDefaultIncludeResult = Prisma.critterGetPayload<
  typeof defaultCritterInclude
>;

type CritterDefaultResponse = Pick<
  CritterDefaultIncludeResult,
  | "critter_id"
  | "wlh_id"
  | "animal_id"
  | "critter_collection_unit"
  | "lk_taxon"
  | "mortality"
>;

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
  update_timestamp: z.coerce.date(),
});

const CritterUpdateSchema = implement<
  Omit<
    Prisma.critterUncheckedUpdateManyInput,
    "critter_id" | keyof AuditColumns
  >
>().with(
  CritterSchema.omit({
    critter_id: true,
    ...noAudit,
  }).partial().shape
);

const CritterCreateSchema = implement<
  Omit<Prisma.critterCreateManyInput, "critter_id" | keyof AuditColumns>
>().with(
  CritterUpdateSchema.required({
    taxon_id: true,
    sex: true,
  }).shape
);

/**
 * Schema for validating a request to fetch multiple critters by their IDs
 */
const CritterIdsRequestSchema = z.object({
  critter_ids: z.array(zodID),
});

const CritterQuerySchema = z.object({ wlh_id: z.string().optional() }); //Add additional properties as needed

const CritterDetailedResponseSchema = ResponseSchema.transform((val) => {
  const {
    mortality,
    capture,
    lk_region_nr,
    lk_taxon,
    marking,
    measurement_qualitative,
    measurement_quantitative,
    user_critter_create_userTouser,
    critter_collection_unit,
    ...rest
  } = val as CritterIncludeResult;
  return {
    ...rest,
    taxon: lk_taxon.taxon_name_common ?? lk_taxon.taxon_name_latin,
    responsible_region: lk_region_nr?.region_nr_name,
    mortality_timestamp: mortality[0]?.mortality_timestamp ?? null,
    system_origin: user_critter_create_userTouser.system_name,
    collection_units: array(SimpleCollectionUnitResponseSchema).parse(
      critter_collection_unit
    ),
    mortality: mortality.map((a) =>
      stripExtraFields(MortalityResponseSchema.parse(a))
    ),
    capture: capture.map((a) =>
      stripExtraFields(CaptureResponseSchema.parse(a))
    ),
    marking: marking.map((a) =>
      stripExtraFields(markingResponseSchema.parse(a))
    ),
    measurement: {
      qualitative: measurement_qualitative.map((a) =>
        stripExtraFields(QualitativeResponseSchema.parse(a))
      ),
      quantitative: measurement_quantitative.map((a) =>
        stripExtraFields(QuantitativeResponseSchema.parse(a))
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
      critter_collection_unit
    ),
    mortality_timestamp: mortality[0]?.mortality_timestamp ?? null,
  };
});

interface critterInterface {
  critter_id?: string;
  create_user?: string;
  update_user?: string;
  create_timestamp?: Date;
  update_timestamp?: Date;
}

const stripExtraFields = <T extends critterInterface>(
  obj: T
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
  CritterIncludeResult,
  CritterDefaultIncludeResult,
  CritterDefaultResponse,
  CritterCreate,
  CritterUpdate,
  CritterIdsRequest,
};
export {
  critterFormats,
  detailedCritterInclude,
  defaultCritterInclude,
  minimalCritterSelect,
  CritterDetailedResponseSchema,
  CritterDefaultResponseSchema,
  CritterUpdateSchema,
  CritterCreateSchema,
  CritterIdsRequestSchema,
  CritterQuerySchema,
};
