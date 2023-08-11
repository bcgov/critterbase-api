import { prisma } from "../../utils/constants";
import { getParentTaxonIds } from "../../utils/helper_functions";

const getCollectionUnitsFromCategoryId = async (category_id: string) => {
  const collectionUnits = await prisma.xref_collection_unit.findMany({
    where: {
      collection_category_id: category_id,
    },
  });
  return collectionUnits;
};

const getCollectionUnitsFromCategory = async (
  category_name: string,
  taxon_name_common?: string,
  taxon_name_latin?: string
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

const getTaxonCollectionCategories = async (taxon_id?: string) => {
  return await prisma.xref_taxon_collection_category.findMany({
    where: { taxon_id },
    include: {
      lk_collection_category: { select: { category_name: true } },
    },
  });
};

const getTaxonMarkingBodyLocations = async (taxon_id?: string) => {
  const ids = taxon_id && (await getParentTaxonIds(taxon_id));
  const result = await prisma.xref_taxon_marking_body_location.findMany(
    ids ? { where: { taxon_id: { in: ids } } } : undefined
  );
  return result;
};

const getTaxonQualitativeMeasurements = async (taxon_id?: string) => {
  const ids = taxon_id && (await getParentTaxonIds(taxon_id));

  const qual = await prisma.xref_taxon_measurement_qualitative.findMany(
    ids ? { where: { taxon_id: { in: ids } } } : undefined
  );

  return qual

};

const getTaxonQuantitativeMeasurements = async (taxon_id?: string) => {
  const ids = taxon_id && (await getParentTaxonIds(taxon_id));

  const quant = await prisma.xref_taxon_measurement_qualitative.findMany(
    ids ? { where: { taxon_id: { in: ids } } } : undefined
  );

  return quant;

};

export {
  getCollectionUnitsFromCategory,
  getCollectionUnitsFromCategoryId,
  getTaxonCollectionCategories,
  getTaxonMarkingBodyLocations,
  getTaxonQuantitativeMeasurements,
  getTaxonQualitativeMeasurements
};
