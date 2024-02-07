import { prisma } from "../../src/utils/constants";

export const seedTaxonCollectionCategory = async (
  categoryId: string,
  tsn: number,
) => {
  try {
    await prisma.xref_taxon_collection_category.create({
      data: {
        collection_category_id: categoryId,
        itis_tsn: tsn,
      },
    });
  } catch (err) {
    console.log("Failed to seed collection unit categories");
    console.log(err);
  }
};
