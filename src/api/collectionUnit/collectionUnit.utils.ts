/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import { critter_collection_unit, Prisma } from '@prisma/client';
import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { AuditColumns } from '../../utils/types';
import { DeleteSchema, implement, noAudit, nonEmpty, ResponseSchema, zodAudit, zodID } from '../../utils/zod_helpers';
extendZodWithOpenApi(z);

// Types
type CollectionUnitIncludes = Prisma.critter_collection_unitGetPayload<typeof collectionUnitIncludes>;

type SimpleCollectionUnitIncludes = Prisma.critter_collection_unitGetPayload<typeof simpleCollectionUnitIncludes>;

type CollectionUnitCreateInput = z.infer<typeof CollectionUnitCreateBodySchema>;

type CollectionUnitUpdateInput = z.infer<typeof CollectionUnitUpdateBodySchema>;

type CollectionUnitResponse = z.TypeOf<typeof CollectionUnitResponseSchema>;

// Constants

// Included related data from lk and xref tables
const collectionUnitIncludes = {
  include: {
    xref_collection_unit: {
      select: { unit_name: true, description: true }
    }
  } satisfies Prisma.critter_collection_unitInclude
};

const simpleCollectionUnitIncludes = {
  include: {
    xref_collection_unit: {
      select: {
        collection_unit_id: true,
        unit_name: true,
        lk_collection_category: {
          select: {
            collection_category_id: true,
            category_name: true
          }
        }
      }
    }
  } satisfies Prisma.critter_collection_unitInclude
};
// Schemas

// Base schema for all critter collection unit related data
const critter_collection_unitSchema = implement<critter_collection_unit>().with({
  critter_collection_unit_id: zodID,
  critter_id: zodID,
  collection_unit_id: zodID,
  ...zodAudit
});

//Extended schema which has both base schema and included fields
const critter_collection_unitIncludesSchema = implement<CollectionUnitIncludes>().with({
  ...critter_collection_unitSchema.shape,
  xref_collection_unit: z.object({
    unit_name: z.string(),
    description: z.string().nullable()
  })
});

// Formatted API response schema which omits fields and unpacks nested data
const CollectionUnitResponseSchema = critter_collection_unitIncludesSchema.transform((obj) => {
  const {
    // omit
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collection_unit_id,
    // include
    xref_collection_unit,
    ...rest
  } = obj;

  return {
    ...rest,
    unit_name: xref_collection_unit?.unit_name ?? null,
    unit_description: xref_collection_unit?.description ?? null
  };
});

const SimpleCollectionUnitResponseSchema = ResponseSchema.transform((obj) => {
  const {
    xref_collection_unit: {
      lk_collection_category: { category_name, collection_category_id },
      unit_name,
      collection_unit_id
    },
    critter_collection_unit_id
  } = obj as SimpleCollectionUnitIncludes;
  return {
    critter_collection_unit_id,
    category_name,
    unit_name,
    collection_unit_id,
    collection_category_id
  };
});

const CollectionUnitDeleteSchema = critter_collection_unitSchema
  .pick({ critter_collection_unit_id: true })
  .extend(DeleteSchema.shape);

// Validate incoming request body for create critter collection unit
const CollectionUnitCreateBodySchema = implement<Omit<Prisma.critter_collection_unitCreateManyInput, AuditColumns>>()
  .with(
    critter_collection_unitSchema
      .omit({ ...noAudit })
      .partial()
      .required({ critter_id: true, collection_unit_id: true }).shape
  )
  .openapi({ description: 'For creating collection untis' });

// Validate incoming request body for update critter collection unit
const CollectionUnitUpdateBodySchema = implement<
  Omit<Prisma.critter_collection_unitUncheckedUpdateManyInput, 'critter_id' | AuditColumns>
>()
  .with(CollectionUnitCreateBodySchema.omit({ critter_id: true }).shape)
  .refine(nonEmpty, 'no new data was provided or the format was invalid');

const CollectionUnitUpsertSchema = critter_collection_unitSchema.omit(noAudit).extend({
  critter_id: zodID.optional(),
  critter_collection_unit_id: zodID.optional()
});

type CollectionUnitUpsertType = z.infer<typeof CollectionUnitUpsertSchema>;

export {
  CollectionUnitCreateBodySchema,
  CollectionUnitDeleteSchema,
  collectionUnitIncludes,
  CollectionUnitResponseSchema,
  CollectionUnitUpdateBodySchema,
  CollectionUnitUpsertSchema,
  critter_collection_unitIncludesSchema,
  SimpleCollectionUnitResponseSchema
};
export type {
  CollectionUnitCreateInput,
  CollectionUnitIncludes,
  CollectionUnitResponse,
  CollectionUnitUpdateInput,
  CollectionUnitUpsertType
};
