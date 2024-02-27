/* eslint-disable @typescript-eslint/ban-types */
import {
  lk_collection_category,
  lk_colour,
  lk_marking_material,
  lk_marking_type,
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
} from "@prisma/client";
import { toSelect } from "../../utils/helper_functions";
import { FormatParse } from "../../utils/types";
import { ResponseSchema } from "../../utils/zod_helpers";

// * FORMATS *
const colourFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_colour>(val, "colour_id", "colour"),
    ),
  },
};

const regionEnvFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_region_env>(val, "region_env_id", "region_env_name"),
    ),
  },
};

const regionNrFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_region_nr>(val, "region_nr_id", "region_nr_name"),
    ),
  },
};

const wmuFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_wildlife_management_unit>(val, "wmu_id", "wmu_name"),
    ),
  },
};

const codFormats: FormatParse = {
  /*asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_cause_of_death>(val, "cod_id", "cod_reason")
    ),
  },*/
  asSelect: {
    schema: ResponseSchema.transform((val) => {
      return {
        key: "cod_id",
        id: val.cod_id,
        value:
          String(val.cod_category) +
          (val.cod_reason ? " | " + String(val.cod_reason) : ""),
      };
    }),
  },
};

const markingMaterialsFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_marking_material>(val, "marking_material_id", "material"),
    ),
  },
};

const markingTypesFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_marking_type>(val, "marking_type_id", "name"),
    ),
  },
};

const collectionUnitCategoriesFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_collection_category>(
        val,
        "collection_category_id",
        "category_name",
      ),
    ),
  },
};

export {
  regionEnvFormats,
  regionNrFormats,
  codFormats,
  wmuFormats,
  markingMaterialsFormats,
  markingTypesFormats,
  collectionUnitCategoriesFormats,
  colourFormats,
};
