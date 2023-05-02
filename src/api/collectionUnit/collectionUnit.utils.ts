/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import {
  critter_collection_unit,
  lk_collection_category,
  lk_taxon,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  nonEmpty,
  ResponseSchema,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";

// Types
type CollectionUnitIncludes = Prisma.critter_collection_unitGetPayload<
  typeof collectionUnitIncludes
>;

type SimpleCollectionUnitIncludes = Prisma.critter_collection_unitGetPayload<
  typeof simpleCollectionUnitIncludes
>;

type CollectionUnitCreateInput = z.infer<typeof CollectionUnitCreateBodySchema>;

type CollectionUnitUpdateInput = z.infer<typeof CollectionUnitUpdateBodySchema>;

type CollectionUnitResponse = z.TypeOf<typeof CollectionUnitResponseSchema>;

// Constants

// Included related data from lk and xref tables
const collectionUnitIncludes = {
  include: {
    xref_collection_unit: {
      select: { unit_name: true, description: true },
    },
  } satisfies Prisma.critter_collection_unitInclude,
};

const simpleCollectionUnitIncludes = {
  include: {
    xref_collection_unit: {
      select: {
        collection_unit_id: true,
        unit_name: true,
        lk_collection_category: { select: { category_name: true } },
      },
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
// const critter_collection_unitIncludesSchema =
//   implement<CollectionUnitIncludes>().with({
//     ...critter_collection_unitSchema.shape,
//     xref_collection_unit: XrefCollectionUnitSchema.pick({
//       unit_name: true,
//       description: true,
//     }),
//   });

// Formatted API response schema which omits fields and unpacks nested data
const CollectionUnitResponseSchema = ResponseSchema.transform((obj) => {
  const {
    // omit
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collection_unit_id,
    // include
    xref_collection_unit,
    ...rest
  } = obj as CollectionUnitIncludes;

  return {
    ...rest,
    unit_name: xref_collection_unit?.unit_name ?? null,
    unit_description: xref_collection_unit?.description ?? null,
  };
});

const SimpleCollectionUnitResponseSchema = ResponseSchema.transform((obj) => {
  const { xref_collection_unit } = obj as SimpleCollectionUnitIncludes;
  return {
    category_name: xref_collection_unit.lk_collection_category.category_name,
    unit_name: xref_collection_unit.unit_name,
    collection_unit_id: xref_collection_unit.collection_unit_id,
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
  Omit<
    Prisma.critter_collection_unitUncheckedUpdateManyInput,
    "critter_collection_unit_id" | keyof AuditColumns
  >
>()
  .with(CollectionUnitCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

const CollectionUnitCategorySchema = implement<
  Partial<
    Pick<lk_taxon, "taxon_name_common" | "taxon_name_latin"> &
      Pick<lk_collection_category, "category_name">
  >
>().with({
  category_name: z.string(),
  taxon_name_latin: z.string().optional(),
  taxon_name_common: z.string().optional(),
});

export {
  CollectionUnitResponseSchema,
  SimpleCollectionUnitResponseSchema,
  simpleCollectionUnitIncludes,
  collectionUnitIncludes,
  CollectionUnitCreateBodySchema,
  CollectionUnitUpdateBodySchema,
  CollectionUnitCategorySchema,
};
export type {
  CollectionUnitIncludes,
  CollectionUnitCreateInput,
  CollectionUnitUpdateInput,
  CollectionUnitResponse,
};
