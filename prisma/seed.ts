import { seedRegions } from "./seed_scripts/seed_regions";
import { prisma } from "../src/utils/constants";
import seedUsers from "./seed_scripts/seed_users";
import {
  seedCausesOfDeath,
  seedCollectionUnitCategory,
  seedColours,
  seedMarkingTypes,
  seedMaterials,
} from "./seed_scripts/seed_lookups";
import {
  seedTaxonBodyLocations,
  seedTaxonCollectionCategory,
  seedTaxonCollectionUnits,
  seedTaxonQualitativeMeasurements,
  seedTaxonQuantitativeMeasurements,
} from "./seed_scripts/seed_xrefs";
import {
  ITIS_TSN,
  CARIBOU_POPULATION_UNITS,
} from "./seed_scripts/seed_constants";

import { seedCritters } from "./seed_scripts/seed_critters";

async function main() {
  /**
   * Abort the seed if data already exists.
   */
  const users = await prisma.user.findMany();
  if (users.length) {
    console.log("Previously seeded. Skipping...");
    return;
  }

  /**
   * Seed system account and developers.
   */
  await seedUsers();

  /**
   * Seed regions with JSON region files.
   */
  await seedRegions();

  /**
   * Seed lookup tables.
   */
  await seedColours();
  await seedMarkingTypes();
  await seedMaterials();
  await seedCausesOfDeath();

  /**
   * Seed taxon cross-ref tables (xref).
   */
  await seedTaxonBodyLocations();
  await seedTaxonQualitativeMeasurements();
  await seedTaxonQuantitativeMeasurements();

  /**
   * Seed collection unit tables for Caribou.
   *
   */
  // Create a collection unit category for population unit.
  const populationUnitId = await seedCollectionUnitCategory("Population Unit");

  // Link population unit category to Caribou.
  await seedTaxonCollectionCategory(populationUnitId, ITIS_TSN.CARIBOU);

  // Populate collection units with caribou population units.
  await seedTaxonCollectionUnits(populationUnitId, CARIBOU_POPULATION_UNITS);

  //Have to do this mess of string manipulation because prisma execute raw will only allow you to run one statement at a time.
  // const sqls = fs
  //   .readFileSync(
  //     path.join(__dirname, "./seed_scripts/import_bctw_animal_data.sql"),
  //   )
  //   .toString()
  //   .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
  //   .split(/\s*;\s*(?=(?:[^']*'[^']*')*[^']*$)/); //this just scans for semicolons that are not enclosed in strings. yes there are semicolons in some of this data...
  //
  // for (const sql of sqls) {
  //   await prisma.$executeRawUnsafe(sql);
  // }

  /**
   * Seed a critter with all attributes
   *
   */
  await seedCritters();
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
