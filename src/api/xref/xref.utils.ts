import {
  lk_taxon,
  lk_collection_category,
  lk_region_env,
  xref_collection_unit,
} from "@prisma/client";
import { z } from "zod";
import { ResponseSchema, implement } from "../../utils/zod_helpers";
import { toSelect } from "../../utils/helper_functions";
import { FormatParse } from "../../utils/types";

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

const CollectionUnitCategoryIdSchema = z
  .object({
    category_id: z.string().optional(),
  })
  .passthrough();

const xrefCollectionUnitFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<xref_collection_unit>(val, "collection_unit_id", "unit_name")
    ),
  },
};

export {
  CollectionUnitCategoryIdSchema,
  CollectionUnitCategorySchema,
  xrefCollectionUnitFormats,
};
