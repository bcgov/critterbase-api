import { critter, Prisma, sex } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
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
import { getCritterByIdWithDetails } from "./critter.service";

const formattedCritterInclude: Prisma.critterInclude = {
  lk_taxon: {
    select: { taxon_name_latin: true },
  },
  lk_region_nr: {
    select: { region_nr_name: true },
  },
  capture: { include: captureInclude },
  mortality: { include: mortalityInclude },
  marking: markingIncludes,
  measurement_qualitative: { include: measurementQualitativeInclude },
  measurement_quantitative: { include: measurementQuantitativeInclude },
};

// type CritterIncludeResult = Prisma.critterGetPayload<
//   typeof formattedCritterInclude
// >;

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

const CritterResponseSchema = ResponseSchema.transform((val) => {
  const {
    mortality,
    capture,
    lk_region_nr,
    lk_taxon,
    marking,
    measurement_qualitative,
    measurement_quantitative,
    ...rest
  } = val as Prisma.PromiseReturnType<typeof getCritterByIdWithDetails>;
  return {
    ...rest,
    taxon_name_latin: lk_taxon?.taxon_name_latin ?? null,
    responsible_region_name: lk_region_nr?.region_nr_name ?? null,
    mortality: mortality?.map((a) =>
      stripExtraFields(MortalityResponseSchema.parse(a))
    ),
    capture: capture?.map((a) =>
      stripExtraFields(CaptureResponseSchema.parse(a))
    ),
    marking: marking?.map((a) =>
      stripExtraFields(markingResponseSchema.parse(a))
    ),
    measurement: {
      qualitative: measurement_qualitative?.map((a) =>
        stripExtraFields(QualitativeResponseSchema.parse(a))
      ),
      quantitative: measurement_quantitative?.map((a) =>
        stripExtraFields(QuantitativeResponseSchema.parse(a))
      ),
    },
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
type FormattedCritter = z.infer<typeof CritterResponseSchema>;

export type {
  FormattedCritter,
  // CritterIncludeResult,
  CritterCreate,
  CritterUpdate,
};
export {
  formattedCritterInclude,
  CritterResponseSchema,
  CritterUpdateSchema,
  CritterCreateSchema,
};
