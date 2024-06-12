import { cod_confidence, mortality, Prisma } from '@prisma/client';
import { z } from 'zod';
import { AuditColumns } from '../utils/types';
import { DeleteSchema, implement, noAudit, zodID } from '../utils/zod_helpers';
import { LocationBody, LocationCreateSchema, LocationUpdateSchema } from '../api/location/location.utils';

/**
 * Mortality base schema (includes audit columns).
 *
 */
const MortalitySchema = implement<mortality>().with({
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
  update_timestamp: z.coerce.date()
});

const MortalityDetailedSchema = MortalitySchema.extend({
  location: z
    .object({
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      coordinate_uncertainty: z.number().nullable(),
      wmu_id: zodID.nullable(),
      region_nr_id: zodID.nullable(),
      region_env_id: zodID.nullable(),
      temperature: z.number().nullable(),
      location_comment: z.string().nullable(),
      region_env_name: z.string().nullable(),
      region_nr_name: z.string().nullable(),
      wmu_name: z.string().nullable()
    })
    .nullable(),
  proximate_cause_of_death: z.object({ cod_category: z.string(), cod_reason: z.string().nullable() }),
  ultimate_cause_of_death: z.object({ cod_category: z.string().nullable(), cod_reason: z.string().nullable() })
});

/**
 * Schema for mortality update payloads.
 *
 */
const MortalityUpdateSchema = implement<
  Omit<Prisma.mortalityUncheckedUpdateManyInput, AuditColumns> & {
    location?: LocationBody;
  }
>().with(
  MortalitySchema.omit({
    ...noAudit
  })
    .extend({ location: LocationUpdateSchema })
    .partial().shape
);

/**
 * Schema for mortality create payloads.
 *
 */
const MortalityCreateSchema = implement<
  Omit<Prisma.mortalityCreateManyInput, AuditColumns> & {
    location?: LocationBody;
  }
>().with(
  MortalitySchema.omit({ ...noAudit })
    .extend({ location: LocationCreateSchema })
    .partial()
    .required({
      critter_id: true,
      mortality_timestamp: true,
      proximate_cause_of_death_id: true
    }).shape
);

/**
 * Schema for mortality delete payloads, used mostly for bulk requests.
 *
 */
const MortalityDeleteSchema = MortalitySchema.pick({
  mortality_id: true
}).extend(DeleteSchema.shape);

/**
 * Inferred schema types.
 *
 */
type MortalityCreate = z.infer<typeof MortalityCreateSchema>;
type MortalityUpdate = z.infer<typeof MortalityUpdateSchema>;
type MortalityDetailed = z.infer<typeof MortalityDetailedSchema>;

export {
  MortalityCreate,
  MortalityUpdate,
  MortalityCreateSchema,
  MortalityUpdateSchema,
  MortalitySchema,
  MortalityDeleteSchema,
  MortalityDetailedSchema,
  MortalityDetailed
};
