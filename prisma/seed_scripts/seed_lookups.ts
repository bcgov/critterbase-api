import { prisma } from "../../src/utils/constants";
/**
 * Seed lookup colours.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedColours = async () => {
  const colours = [
    "Blue",
    "Red",
    "Yellow",
    "Orange",
    "Black",
    "Green",
    "Pink",
    "White",
    "Purple",
  ];

  console.log(`Seeding (${colours.length}) lookup colours...`);

  await prisma.lk_colour.createMany({
    data: colours.map((colour) => ({ colour })),
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
  const materials = [{ material: "Plastic" }, { material: "Metal" }];

  console.log(`Seeding (${materials.length}) lookup materials...`);

  await prisma.lk_marking_material.createMany({
    data: materials,
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
  const markingTypes = [{ name: "Ear Tag" }];

  console.log(`Seeding (${markingTypes.length}) lookup marking types...`);

  await prisma.lk_marking_type.createMany({
    data: markingTypes,
  });
};

/**
 * Seed lookup causes of death.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedCausesOfDeath = async () => {
  const causesOfDeath = [
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
  ];

  console.log(`Seeding (${causesOfDeath.length}) lookup causes of death...`);

  const data = causesOfDeath.map((cod) => ({
    cod_category: cod.cod_category,
    cod_reason: cod.cod_reason,
  }));

  await prisma.lk_cause_of_death.createMany({
    data,
  });
};

/**
 * Seeds a single collection unit category.
 *
 * @async
 * @param {string} categoryName
 * @throws {Error} - throws if prisma requests returns undefined.
 * @returns {Promise<string>}
 */
export const seedCollectionUnitCategory = async (categoryName: string) => {
  console.log(
    `Seeding (1) lookup collection unit category: '${categoryName}'...`,
  );

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
