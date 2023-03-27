import { Prisma } from "@prisma/client";
import { z } from "zod";
import { nonEmpty } from "../../utils/zod_schemas";
import {
  critter_collection_unitSchema,
  xref_collection_unitSchema,
} from "../../../prisma/zod_schemas";

// Types
type CollectionUnitCreateInput = z.infer<typeof CollectionUnitCreateBodySchema>;
type CollectionUnitUpdateInput = z.infer<typeof CollectionUnitUpdateBodySchema>;

type CollectionUnitResponse = z.TypeOf<typeof collectionUnitResponseSchema>;

// Constants
const collectionUnitIncludes = {
  include: {
    xref_collection_unit: {
      select: { unit_name: true, description: true },
    },
  } satisfies Prisma.critter_collection_unitInclude,
};

const collectionUnitResponseSchema = critter_collection_unitSchema
  .and(
    z.object({
      xref_collection_unit: xref_collection_unitSchema.pick({
        unit_name: true,
        description: true,
      }),
    })
  )
  .transform((arg) => {
    return {
      critter_collection_unit_id: arg.critter_collection_unit_id,
      critter_id: arg.critter_id,
      unit_name: arg.xref_collection_unit.unit_name,
      unit_description: arg.xref_collection_unit.description,
      create_user: arg.create_user,
      update_user: arg.update_user,
      create_timestamp: arg.create_timestamp,
      update_timestamp: arg.update_timestamp,
    };
  });


// Validate request body for create collection unit
const CollectionUnitCreateBodySchema = z.object({
  critter_id: z.string().uuid(),
  collection_unit_id: z.string().uuid(),
}) satisfies z.ZodType<Prisma.critter_collection_unitUncheckedCreateInput>;

// Validate request body for update collection unit
const CollectionUnitUpdateBodySchema =
  CollectionUnitCreateBodySchema.partial().refine(
    nonEmpty,
    "no new data was provided or the format was invalid"
  ) satisfies z.ZodType<Prisma.critter_collection_unitUncheckedUpdateInput>;

export {
  collectionUnitResponseSchema,
  collectionUnitIncludes,
  CollectionUnitCreateBodySchema,
  CollectionUnitUpdateBodySchema,
};
export type {
  CollectionUnitCreateInput,
  CollectionUnitUpdateInput,
  CollectionUnitResponse,
};
