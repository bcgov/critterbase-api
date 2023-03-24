import { Prisma } from "@prisma/client";
import { z } from "zod";
import { nonEmpty } from "../../utils/zod_schemas";

// Types
type CollectionUnitCreateInput = z.infer<typeof CollectionUnitCreateBodySchema>;
type CollectionUnitUpdateInput = z.infer<typeof CollectionUnitUpdateBodySchema>;

// Zod schema to validate create collection unit data
const CollectionUnitCreateBodySchema = z.object({
  critter_id: z.string().uuid(),
  collection_unit_id: z.string().uuid(),
}) satisfies z.ZodType<Prisma.critter_collection_unitUncheckedCreateInput>;

// Zod schema to validate update collection unit data
const CollectionUnitUpdateBodySchema =
  CollectionUnitCreateBodySchema.partial().refine(
    nonEmpty,
    "no new data was provided or the format was invalid"
  ) satisfies z.ZodType<Prisma.critter_collection_unitUncheckedUpdateInput>;

export { CollectionUnitCreateBodySchema, CollectionUnitUpdateBodySchema };
export type { CollectionUnitCreateInput, CollectionUnitUpdateInput };
