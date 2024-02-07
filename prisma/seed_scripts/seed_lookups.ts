import { prisma } from "../../src/utils/constants";
import { queryRandomUUID } from "../prisma_utils";
/**
 * Seed lookup colours.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedColours = async () => {
  console.log("Seeding lookup colours...");
  await prisma.lk_colour.createMany({
    data: [
      "Blue",
      "Red",
      "Yellow",
      "Orange",
      "Black",
      "Green",
      "Pink",
      "White",
      "Purple",
    ].map((colour) => ({ colour })),
  });
};

/**
 * Seed lookup materials.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedMaterials = async () => {
  console.log("Seeding lookup materials...");
  await prisma.lk_marking_material.createMany({
    data: [{ material: "Plastic" }, { material: "Metal" }],
  });
};

/**
 * Seed lookup marking types.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedMarkingTypes = async () => {
  console.log("Seeding lookup marking types...");
  try {
    await prisma.lk_marking_type.createMany({
      data: [{ name: "Ear Tag" }],
    });
  } catch (err) {
    console.log("Failed to seed lookup marking types.");
    console.log(err);
  }
};

/**
 * Seed lookup causes of death.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedCausesOfDeath = async () => {
  console.log("Seeding lookup causes of death...");
  const data = [
    { cod_category: "Natural Disaster", cod_reason: "Avalanche" },
    { cod_category: "Natural Disaster", cod_reason: "Unknown" },
    { cod_category: "Collision", cod_reason: "Train" },
    { cod_category: "Collision", cod_reason: "Motor vehicle" },
    { cod_category: "Natural", cod_reason: null },
    { cod_category: "Predation", cod_reason: null },
    { cod_category: "Illness/Disease", cod_reason: null },
    { cod_category: "Poison/Toxic Exposure", cod_reason: null },
    { cod_category: "Harvest", cod_reason: "Trapping" },
    { cod_category: "Harvest", cod_reason: "Licensed" },
    { cod_category: "Harvest", cod_reason: "Unlicensed" },
    { cod_category: "Harvest", cod_reason: "Aboriginal" },
    { cod_category: "Purposeful Removal", cod_reason: null },
    { cod_category: "Property/Life Defence", cod_reason: null },
    { cod_category: "Unknown", cod_reason: null },
  ].map((cod) => ({
    cod_category: cod.cod_category,
    cod_reason: cod.cod_reason,
  }));

  await prisma.lk_cause_of_death.createMany({
    data,
  });
};

export const seedCollectionUnitCategory = async (categoryName: string) => {
  console.log(`Seeding lookup collection unit category: '${categoryName}'...`);
  const { collection_category_id } = await prisma.lk_collection_category.create(
    {
      data: {
        category_name: categoryName,
      },
    },
  );

  if (!collection_category_id) {
    throw new Error("Collection category returned null");
  }
  return collection_category_id;
};
