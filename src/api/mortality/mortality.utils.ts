/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { cod_confidence, mortality, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  ResponseSchema,
  zodID,
} from "../../utils/zod_helpers";
import {
  CommonFormattedLocationSchema,
  CommonLocationSchema,
  commonLocationSelect,
  CommonLocationValidation,
  LocationBody,
  LocationCreateSchema,
  LocationUpdateSchema,
} from "../location/location.utils";

const MortalityBodySchema = implement<mortality>().with({
  mortality_id: zodID,
  critter_id: zodID,
  location_id: zodID.nullable(),
  mortality_timestamp: z.coerce.date(),
  proximate_cause_of_death_id: zodID,
  proximate_cause_of_death_confidence: z.nativeEnum(cod_confidence).nullable(),
  proximate_predated_by_taxon_id: zodID.nullable(),
  ultimate_cause_of_death_id: zodID.nullable(),
  ultimate_cause_of_death_confidence: z.nativeEnum(cod_confidence).nullable(),
  ultimate_predated_by_taxon_id: zodID.nullable(),
  mortality_comment: z.string().nullable(),
  create_user: zodID,
  update_user: zodID,
  create_timestamp: z.coerce.date(),
  update_timestamp: z.coerce.date(),
});

const mortalityInclude = Prisma.validator<Prisma.mortalityArgs>()({
  include: {
    location: {
      ...commonLocationSelect,
    },
    lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death:
      {
        select: {
          cod_category: true,
          cod_reason: true,
        },
      },
    lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: {
      select: {
        taxon_id: true,
        taxon_name_latin: true,
      },
    },
    lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: {
      select: {
        cod_category: true,
        cod_reason: true,
      },
    },
    lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: {
      select: {
        taxon_id: true,
        taxon_name_latin: true,
      },
    },
  },
});

const MortalityIncludeSchema = implement<MortalityIncludeType>().with({
  ...MortalityBodySchema.shape,
  location: CommonLocationSchema,
  lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: z.object({cod_category: z.string(), cod_reason: z.string().nullable()}),
  lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: z.object({taxon_id: z.string(), taxon_name_latin: z.string()}).nullable(),
  lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: z.object({cod_category: z.string(), cod_reason: z.string().nullable()}).nullable(),
  lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: z.object({taxon_id: z.string(), taxon_name_latin: z.string()}).nullable()
})

const MortalityUpdateSchema = implement<
  Omit<
    Prisma.mortalityUncheckedUpdateManyInput,
    keyof AuditColumns
  > & { location?: LocationBody }
>().with(
  MortalityBodySchema.omit({
    ...noAudit,
  }).extend({location: LocationUpdateSchema}).partial().shape
);

const MortalityCreateSchema = implement<
  Omit<Prisma.mortalityCreateManyInput, keyof AuditColumns>
  & { location?: LocationBody }
>().with(
  MortalityBodySchema.omit({...noAudit})
  .extend({location: LocationCreateSchema})
  .partial()
  .required({
    critter_id: true,
    mortality_timestamp: true,
    proximate_cause_of_death_id: true
  }).shape
);

type MortalityCreate = z.infer<typeof MortalityCreateSchema>;
type MortalityUpdate = z.infer<typeof MortalityUpdateSchema>;

type MortalityIncludeType = Prisma.mortalityGetPayload<typeof mortalityInclude>;

const MortalityResponseSchema = ResponseSchema.transform((val) => {
  const {
    location,
    lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death,
    lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death,
    lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon,
    lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon,
    ...rest
  } = val as MortalityIncludeType;
  return {
    ...rest,
    location: location ? CommonFormattedLocationSchema.parse(location) : null,
    proximate_cause_of_death:
      lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death ??
      null,
    ultimate_cause_of_death:
      lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death ??
      null,
    proximate_cause_of_death_taxon:
      lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon ?? null,
    ultimate_cause_of_death_taxon:
      lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon ?? null,
  };
});

type FormattedMortality = z.infer<typeof MortalityResponseSchema>;

export {
  mortalityInclude,
  MortalityCreateSchema,
  MortalityUpdateSchema,
  MortalityResponseSchema,
  MortalityBodySchema,
  MortalityIncludeSchema
  
};
export type {
  MortalityIncludeType,
  FormattedMortality,
  MortalityCreate,
  MortalityUpdate,
};
