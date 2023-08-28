import {
  Prisma,
  lk_collection_category,
  lk_taxon,
  xref_collection_unit,
  xref_taxon_marking_body_location,
  xref_taxon_measurement_qualitative,
  xref_taxon_measurement_qualitative_option,
} from "@prisma/client";
import { z } from "zod";
import { toSelect } from "../../utils/helper_functions";
import { FormatParse, ISelect } from "../../utils/types";
import { ResponseSchema, implement } from "../../utils/zod_helpers";
import { getTaxonCollectionCategories } from "./xref.service";

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

const xrefTaxonCollectionCategoryFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) => {
      const {
        collection_category_id,
        lk_collection_category: { category_name },
      } = val as Prisma.PromiseReturnType<
        typeof getTaxonCollectionCategories
      >[0];

      return {
        id: collection_category_id,
        key: "collection_category_id",
        value: category_name,
      } satisfies ISelect;
    }),
  },
};

const xrefTaxonMeasurementSchema: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<xref_taxon_measurement_qualitative>(
        val,
        "taxon_measurement_id",
        "measurement_name"
      )
    ),
  },
};

const xrefTaxonMeasurementOptionSchema: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<xref_taxon_measurement_qualitative_option>(
        val,
        "qualitative_option_id",
        "option_label"
      )
    ),
  },
};

const xrefTaxonMarkingBodyLocationFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<xref_taxon_marking_body_location>(
        val,
        "taxon_marking_body_location_id",
        "body_location"
      )
    ),
  },
};

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
  xrefTaxonCollectionCategoryFormats,
  xrefTaxonMarkingBodyLocationFormats,
  xrefTaxonMeasurementSchema,
  xrefTaxonMeasurementOptionSchema,
};
