import { critter_collection_unit, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  nonEmpty,
  XrefCollectionUnitSchema,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";

// Types
type CollectionUnitIncludes = Prisma.critter_collection_unitGetPayload<
  typeof collectionUnitIncludes
>;

type CollectionUnitCreateInput = z.infer<typeof CollectionUnitCreateBodySchema>;

type CollectionUnitUpdateInput = z.infer<typeof CollectionUnitUpdateBodySchema>;

type CollectionUnitResponse = z.TypeOf<typeof collectionUnitResponseSchema>;

// Constants

// Included related data from lk and xref tables
const collectionUnitIncludes = {
  include: {
    xref_collection_unit: {
      select: { unit_name: true, description: true },
    },
  } satisfies Prisma.critter_collection_unitInclude,
};

// Schemas

// Base schema for all critter collection unit related data
const critter_collection_unitSchema = implement<critter_collection_unit>().with(
  {
    critter_collection_unit_id: zodID,
    critter_id: zodID,
    collection_unit_id: zodID,
    ...zodAudit,
  }
);

// Extended schema which has both base schema and included fields
const critter_collection_unitIncludesSchema =
  implement<CollectionUnitIncludes>().with({
    ...critter_collection_unitSchema.shape,
    xref_collection_unit: XrefCollectionUnitSchema.pick({
      unit_name: true,
      description: true,
    }),
  });

// Formatted API reponse schema which omits fields and unpacks nested data
const collectionUnitResponseSchema =
  critter_collection_unitIncludesSchema.transform((val) => {
    return {
      critter_collection_unit_id: val.critter_collection_unit_id,
      critter_id: val.critter_id,
      unit_name: val.xref_collection_unit.unit_name,
      unit_description: val.xref_collection_unit.description,
      create_user: val.create_user,
      update_user: val.update_user,
      create_timestamp: val.create_timestamp,
      update_timestamp: val.update_timestamp,
    };
  });

// Validate incoming request body for create critter collection unit
const CollectionUnitCreateBodySchema = implement<
  Omit<
    Prisma.critter_collection_unitCreateManyInput,
    "critter_collection_unit_id" | keyof AuditColumns
  >
>().with(
  critter_collection_unitSchema
    .omit({ ...noAudit, critter_collection_unit_id: true })
    .partial()
    .required({ critter_id: true, collection_unit_id: true }).shape
);

// Validate incoming request body for update critter collection unit
const CollectionUnitUpdateBodySchema = implement<
  Omit<Prisma.critter_collection_unitUncheckedUpdateManyInput, "critter_collection_unit_id" | keyof AuditColumns>
>()
  .with(CollectionUnitCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

export {
  collectionUnitResponseSchema,
  collectionUnitIncludes,
  CollectionUnitCreateBodySchema,
  CollectionUnitUpdateBodySchema,
};
export type {
  CollectionUnitIncludes,
  CollectionUnitCreateInput,
  CollectionUnitUpdateInput,
  CollectionUnitResponse,
};