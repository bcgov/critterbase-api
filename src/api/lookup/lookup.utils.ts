/* eslint-disable @typescript-eslint/ban-types */
import {
  lk_cause_of_death,
  lk_collection_category,
  lk_marking_material,
  lk_marking_type,
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
} from "@prisma/client";
import { Dropdown, FormatParse } from "../../utils/types";
import { ResponseSchema } from "../../utils/zod_helpers";
import { objectOutputType, ZodTypeAny } from "zod";
const toDropdown = <AsType>(
  val: objectOutputType<{}, ZodTypeAny, "passthrough">,
  key: keyof AsType & string,
  valueKey: keyof AsType & string
) => {
  const castVal = val as AsType;
  return {
    key,
    id: String(castVal[key]),
    value: String(castVal[valueKey]),
  } satisfies Dropdown;
};

// * FORMATS *
const regionEnvFormats: FormatParse = {
  dropdown: {
    schema: ResponseSchema.transform((val) =>
      toDropdown<lk_region_env>(val, "region_env_id", "region_env_name")
    ),
  },
};

const regionNrFormats: FormatParse = {
  dropdown: {
    schema: ResponseSchema.transform((val) =>
      toDropdown<lk_region_nr>(val, "region_nr_id", "region_nr_name")
    ),
  },
};

const wmuFormats: FormatParse = {
  dropdown: {
    schema: ResponseSchema.transform((val) =>
      toDropdown<lk_wildlife_management_unit>(val, "wmu_id", "wmu_name")
    ),
  },
};

const codFormats: FormatParse = {
  dropdown: {
    schema: ResponseSchema.transform((val) =>
      toDropdown<lk_cause_of_death>(val, "cod_id", "cod_reason")
    ),
  },
};

const markingMaterialsFormats: FormatParse = {
  dropdown: {
    schema: ResponseSchema.transform((val) =>
      toDropdown<lk_marking_material>(val, "marking_material_id", "material")
    ),
  },
};

const markingTypesFormats: FormatParse = {
  dropdown: {
    schema: ResponseSchema.transform((val) =>
      toDropdown<lk_marking_type>(val, "marking_type_id", "name")
    ),
  },
};

const collectionUnitCategoriesFormats: FormatParse = {
  dropdown: {
    schema: ResponseSchema.transform((val) =>
      toDropdown<lk_collection_category>(
        val,
        "collection_category_id",
        "category_name"
      )
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
};
