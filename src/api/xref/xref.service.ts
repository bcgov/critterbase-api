import { prisma } from "../../utils/constants";

const getCollectionUnitsFromCategoryId = async (category_id: string) => {
  const collectionUnits = await prisma.xref_collection_unit.findMany({
    where: {
      collection_category_id: category_id,
    },
  });
  console.log(collectionUnits);
  return collectionUnits;
};

const getCollectionUnitsFromCategory = async (
  category_name: string,
  taxon_name_common: string | undefined,
  taxon_name_latin: string | undefined
) => {
  const taxon_categories =
    await prisma.xref_taxon_collection_category.findFirstOrThrow({
      where: {
        lk_taxon: {
          taxon_name_common: taxon_name_common
            ? { equals: taxon_name_common, mode: "insensitive" }
            : undefined,
          taxon_name_latin: taxon_name_latin
            ? { equals: taxon_name_latin, mode: "insensitive" }
            : undefined,
        },
        lk_collection_category: {
          category_name: { equals: category_name, mode: "insensitive" },
        },
      },
    });
  const category_id = taxon_categories.collection_category_id;
  return await getCollectionUnitsFromCategoryId(category_id);
};

export { getCollectionUnitsFromCategory, getCollectionUnitsFromCategoryId };
