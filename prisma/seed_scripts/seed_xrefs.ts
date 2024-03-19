import { prisma } from "../../src/utils/constants";
import { ITIS_TSN } from "./seed_constants";

interface ICollectionUnitSeed {
  tsn: ITIS_TSN;
  categoryName: string;
  collectionUnits: string[];
}

/**
 * Seeds a link for tsn to collection category. ie: Caribou -> Population Unit.
 *
 * @async
 * @param {string} categoryId - [TODO:description]
 * @param {number} tsn - [TODO:description]
 * @returns {Promise<[TODO:type]>} [TODO:description]
 */
export const seedTaxonCollectionCategory = async (
  categoryId: string,
  tsn: number
) => {
  console.log(`Seeding (1) collection category for: '${ITIS_TSN[tsn]}'...`);

  await prisma.xref_taxon_collection_category.create({
    data: {
      collection_category_id: categoryId,
      itis_tsn: tsn,
    },
  });
};

/**
 * Seeds collection units for a collection category.
 *
 * @async
 * @param {string} categoryId - collection_category_id
 * @param {string[]} units - collection units array
 * @throws
 * @returns {Promise<void>}
 */
export const seedTaxonCollectionUnits = async (
  categoryId: string,
  units: string[]
) => {
  console.log(`Seeding (${units.length}) collection units...`);

  await prisma.xref_collection_unit.createMany({
    data: units.map((unit) => ({
      collection_category_id: categoryId,
      unit_name: unit,
    })),
  });
};

/**
 * Seeds taxon qualitative measurement definitions and associated options.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedTaxonQualitativeMeasurements = async () => {
  const measurements = [
    {
      name: "Life Stage",
      itis_tsn: ITIS_TSN.CANIS_LUPUS,
      options: ["Adult", "Subadult", "Young of year", "Juvenile", "Neonate"],
    },
    {
      name: "Life Stage",
      itis_tsn: ITIS_TSN.ARTIODACTYLA,
      options: ["Adult", "Subadult", "Young of year", "Juvenile", "Pup"],
    },
    {
      name: "Juvenile at heel indicator",
      itis_tsn: ITIS_TSN.ANIMALIA,
      options: ["False", "True"],
    },
  ];

  console.log(
    `Seeding (${measurements.length}) qualitative measurements and options...`
  );

  // Create qualitative measurements and associated options
  for (const measurement of measurements) {
    await prisma.xref_taxon_measurement_qualitative.create({
      data: {
        itis_tsn: measurement.itis_tsn,
        measurement_name: measurement.name,
        xref_taxon_measurement_qualitative_option: {
          create: measurement.options.map((option, index) => ({
            option_label: option,
            option_value: index,
          })),
        },
      },
    });
  }
};

/**
 * Seeds taxon quantitative measurement definitions.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedTaxonQuantitativeMeasurements = async () => {
  const measurements = [
    { name: "Estimated age", itis_tsn: ITIS_TSN.ANIMALIA },
    { name: "Juvenile count", itis_tsn: ITIS_TSN.ANIMALIA },
  ];

  console.log(`Seeding (${measurements.length}) quantitative measurements...`);

  await prisma.xref_taxon_measurement_quantitative.createMany({
    data: measurements.map((quantitative) => {
      return {
        measurement_name: quantitative.name,
        itis_tsn: quantitative.itis_tsn,
      };
    }),
  });
};

/**
 * Seeds taxon body location defintions.
 *
 * @async
 * @throws
 * @returns {Promise<void>}
 */
export const seedTaxonBodyLocations = async () => {
  const bodyLocations = ["Left Ear", "Right Ear"];

  console.log(`Seeding (${bodyLocations.length}) body locations...`);

  await prisma.xref_taxon_marking_body_location.createMany({
    data: bodyLocations.map((location) => {
      return { itis_tsn: ITIS_TSN.ANIMALIA, body_location: location };
    }),
  });
};
