/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { cod_confidence, mortality, Prisma } from "@prisma/client";
import { z } from "zod";
import {
  DeleteSchema,
  implement,
  noAudit,
  ResponseSchema,
  zodID,
} from "../../utils/zod_helpers";
import {
  CommonFormattedLocationSchema,
  CommonLocationSchema,
  commonLocationSelect,
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
  proximate_predated_by_itis_tsn: z.number().nullable(),
  ultimate_cause_of_death_id: zodID.nullable(),
  ultimate_cause_of_death_confidence: z.nativeEnum(cod_confidence).nullable(),
  ultimate_predated_by_itis_tsn: z.number().nullable(),
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
    lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: {
      select: {
        cod_category: true,
        cod_reason: true,
      },
    },
  },
});

const MortalityIncludeSchema = implement<MortalityIncludeType>().with({
  ...MortalityBodySchema.shape,
  location: CommonLocationSchema,
  lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death:
    z.object({ cod_category: z.string(), cod_reason: z.string().nullable() }),
  lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: z
    .object({ cod_category: z.string(), cod_reason: z.string().nullable() })
    .nullable(),
});

const MortalityUpdateSchema = MortalityBodySchema.omit({
  ...noAudit,
})
  .extend({ location: LocationUpdateSchema })
  .partial();

const MortalityCreateSchema = MortalityBodySchema.omit({ ...noAudit })
  .extend({ location: LocationCreateSchema })
  .partial()
  .required({
    critter_id: true,
    mortality_timestamp: true,
    proximate_cause_of_death_id: true,
  });

type MortalityCreate = z.infer<typeof MortalityCreateSchema>;
type MortalityUpdate = z.infer<typeof MortalityUpdateSchema>;

type MortalityIncludeType = Prisma.mortalityGetPayload<typeof mortalityInclude>;

const MortalityResponseSchema = ResponseSchema.transform((val) => {
  const {
    location,
    lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death,
    lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death,
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
  };
});

type FormattedMortality = z.infer<typeof MortalityResponseSchema>;

const MortalityDeleteSchema = MortalityBodySchema.pick({
  mortality_id: true,
}).extend(DeleteSchema.shape);

export {
  mortalityInclude,
  MortalityCreateSchema,
  MortalityUpdateSchema,
  MortalityResponseSchema,
  MortalityBodySchema,
  MortalityIncludeSchema,
  MortalityDeleteSchema,
};
export type {
  MortalityIncludeType,
  FormattedMortality,
  MortalityCreate,
  MortalityUpdate,
};
