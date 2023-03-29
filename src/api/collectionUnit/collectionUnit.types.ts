import { Prisma } from "@prisma/client";
import { z } from "zod";
import { nonEmpty, xref_collection_unitSchema } from "../../utils/zod_helpers";

// Types
type CollectionUnitCreateInput = z.infer<typeof CollectionUnitCreateBodySchema>;
type CollectionUnitUpdateInput = z.infer<typeof CollectionUnitUpdateBodySchema>;

type CollectionUnitResponse = z.TypeOf<typeof collectionUnitResponseSchema>;

// Constants
const critter_collection_unitSchema = z.object({
  critter_collection_unit_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  collection_unit_id: z.string().uuid(),
  create_user: z.string().uuid(),
  update_user: z.string().uuid(),
  create_timestamp: z.date(),
  update_timestamp: z.date(),
})

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
