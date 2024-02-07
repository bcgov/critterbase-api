import { seedRegions } from "./seed_scripts/seed_regions";
import { prisma } from "../src/utils/constants";
import seedUsers from "./seed_scripts/seed_users";
import {
  seedCausesOfDeath,
  seedCollectionUnitCategory,
  seedColours,
  seedMaterials,
} from "./seed_scripts/seed_lookups";
import { seedTaxonCollectionCategory } from "./seed_scripts/seed_xrefs";
import ITIS_TSN from "./seed_scripts/tsn";

async function main() {
  /**
   * Abort the seed if data already exists
   */
  const existingUsers = await prisma.user.findMany();
  if (existingUsers.length) {
    console.log("Previously seeded. Skipping...");
    return;
  }

  /**
   * Seed system account and developers
   */
  await seedUsers();

  /**
   * Seed regions with large JSON region files
   */
  await seedRegions();

  /**
   * Seed lookup tables
   */
  await seedColours();
  await seedMaterials();
  await seedCausesOfDeath();
  const populationUnitId = await seedCollectionUnitCategory("Population Unit");

  /**
   * Seed taxon cross-ref tables (xref)
   */
  // Link population units to Caribou
  await seedTaxonCollectionCategory(populationUnitId, ITIS_TSN.CARIBOU);

  /*
   * Now give the Population Unit category all of its usable values.
   */
  // const population_units = (await prisma.lk_population_unit_temp.findMany())
  //   .filter((a) => a !== null)
  //   .map((a) => a.unit_name) as string[];
  // await prisma.xref_collection_unit.createMany({
  //   data: population_units.map((p) => {
  //     return { collection_category_id: populationUnitId, unit_name: p };
  //   }),
  // });

  /*
   * Now configure body locations for markings.
   */
  // const bodyLocations = ["Left Ear", "Right Ear"];
  // await prisma.xref_taxon_marking_body_location.createMany({
  //   data: bodyLocations.map((b) => {
  //     return { taxon_id: rangiferTarandusUUID, body_location: b };
  //   }),
  // });

  /*
   * Measurements section, note the use of different taxon UUIDs
   */
  // const qualitativeMeasures = [
  //   {
  //     name: "Life Stage",
  //     taxon: canisLupusUUID,
  //     options: ["Adult", "Subadult", "Young of year", "Juvenile", "Neonate"],
  //   },
  //   {
  //     name: "Life Stage",
  //     taxon: artioUUID,
  //     options: ["Adult", "Subadult", "Young of year", "Juvenile", "Pup"],
  //   },
  //   {
  //     name: "Juvenile at heel indicator",
  //     taxon: mammaliaUUID,
  //     options: ["False", "True"],
  //   },
  // ];
  //
  // await prisma.xref_taxon_measurement_qualitative.createMany({
  //   data: qualitativeMeasures.map((q) => {
  //     return { taxon_id: q.taxon, measurement_name: q.name };
  //   }),
  // });

  // const qualitativeResults =
  //   await prisma.xref_taxon_measurement_qualitative.findMany();
  // for (const q of qualitativeMeasures) {
  //   const uuid = qualitativeResults.find(
  //     (a) => a.measurement_name === q.name && a.taxon_id === q.taxon,
  //   )?.taxon_measurement_id;
  //   if (!uuid) {
  //     throw Error("Could not find a required measurement id");
  //   }
  //   await prisma.xref_taxon_measurement_qualitative_option.createMany({
  //     data: q.options.map((o, idx) => {
  //       return {
  //         taxon_measurement_id: uuid,
  //         option_label: o,
  //         option_value: idx,
  //       };
  //     }),
  //   });
  // }
  //
  // const quantitativeMeasures = [
  //   { name: "Estimated age", taxon: mammaliaUUID },
  //   { name: "Juvenile count", taxon: mammaliaUUID },
  // ];
  // await prisma.xref_taxon_measurement_quantitative.createMany({
  //   data: quantitativeMeasures.map((q) => {
  //     return { measurement_name: q.name, taxon_id: q.taxon };
  //   }),
  // });

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

  console.log("Successfully seeded the database.");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
