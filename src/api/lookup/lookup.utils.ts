/* eslint-disable @typescript-eslint/ban-types */
import {
  Prisma,
  lk_cause_of_death,
  lk_collection_category,
  lk_marking_material,
  lk_marking_type,
  lk_region_env,
  lk_region_nr,
  lk_taxon,
  lk_wildlife_management_unit,
} from "@prisma/client";
import { ZodTypeAny, objectOutputType } from "zod";
import { FormatParse, ISelect } from "../../utils/types";
import { ResponseSchema } from "../../utils/zod_helpers";
const toSelect = <AsType>(
  val: objectOutputType<{}, ZodTypeAny, "passthrough">,
  key: keyof AsType & string,
  valueKey: keyof AsType & string
) => {
  const castVal = val as AsType;
  return {
    key,
    id: String(castVal[key]),
    value: String(castVal[valueKey]),
  } satisfies ISelect;
};

// * FORMATS *
const regionEnvFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_region_env>(val, "region_env_id", "region_env_name")
    ),
  },
};

const regionNrFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_region_nr>(val, "region_nr_id", "region_nr_name")
    ),
  },
};

const wmuFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_wildlife_management_unit>(val, "wmu_id", "wmu_name")
    ),
  },
};

const codFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_cause_of_death>(val, "cod_id", "cod_reason")
    ),
  },
};

const markingMaterialsFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_marking_material>(val, "marking_material_id", "material")
    ),
  },
};

const markingTypesFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_marking_type>(val, "marking_type_id", "name")
    ),
  },
};

const collectionUnitCategoriesFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) =>
      toSelect<lk_collection_category>(
        val,
        "collection_category_id",
        "category_name"
      )
    ),
  },
};

const taxonFormats: FormatParse = {
  asSelect: {
    schema: ResponseSchema.transform((val) => {
      const { taxon_id, taxon_name_common, taxon_name_latin } = val as lk_taxon;
      return {
        key: Object.keys({ taxon_id })[0], //This helps to ensure the key is correctly named with schema
        id: taxon_id,
        value: taxon_name_common ?? taxon_name_latin,
      };
    }),
  },
};

//Prisma includes/selects/wheres
const taxonSpeciesAndSubsWhere = {
  where: {
    OR: [
      {
        genus_id: {
          not: null,
        },
        species_id: null,
      },
      {
        species_id: {
          not: null,
        },
        sub_species_id: null,
      },
    ],
  } satisfies Prisma.lk_taxonWhereInput,
};
export {
  regionEnvFormats,
  regionNrFormats,
  codFormats,
  wmuFormats,
  markingMaterialsFormats,
  markingTypesFormats,
  collectionUnitCategoriesFormats,
  taxonFormats,
  taxonSpeciesAndSubsWhere,
};
