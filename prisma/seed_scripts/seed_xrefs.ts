import { prisma } from "../../src/utils/constants";
import { ITIS_TSN } from "./seed_constants";
import { taxonMeasurementQualitativeData, taxonMeasurementQuantitativeData } from "./seed_measurements";

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
  tsn: number,
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
  units: string[],
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
  console.log(
    `Seeding (${taxonMeasurementQualitativeData.length}) qualitative measurements and options...`,
  );

  // Create qualitative measurements and associated options
  for (const measurement of taxonMeasurementQualitativeData) {
    await prisma.xref_taxon_measurement_qualitative.create({
      data: {
        itis_tsn: measurement.itis_tsn,
        measurement_name: measurement.measurement_name,
        xref_taxon_measurement_qualitative_option: {
          create: measurement.options.map((option, index) => ({
            option_label: option.option_label,
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
  console.log(`Seeding (${taxonMeasurementQuantitativeData.length}) quantitative measurements...`);

  await prisma.xref_taxon_measurement_quantitative.createMany({
    data: taxonMeasurementQuantitativeData
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
      return { itis_tsn: ITIS_TSN.CARIBOU, body_location: location };
    }),
  });
};
