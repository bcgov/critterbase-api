import nrRegionJson from "./region_data/ADM_NR_REGIONS_SP.json";
import envRegionJson from "./region_data/EADM_WLAP_REGION_BND_AREA_SVW.json";
import wmuJson from "./region_data/WAA_WILDLIFE_MGMT_UNITS_SVW.json";
import popUnitJson from "./region_data/GCPB_CARIBOU_POPULATION_SP.json";
import { prisma } from "../../src/utils/constants";

interface RegionStructure {
  tableName: string;
  importedJson: any;
  tableUnitName: string;
  tableGeomName: string;
  tableIdName: string;
  jsonRegionName: string;
  isMultiPolygon: boolean;
}

const regionStructureList: RegionStructure[] = [
  {
    tableName: "lk_region_nr",
    tableIdName: "region_nr_id",
    tableUnitName: "region_nr_name",
    tableGeomName: "region_geom",
    importedJson: nrRegionJson,
    jsonRegionName: "REGION_NAME",
    isMultiPolygon: false,
  },
  {
    tableName: "lk_region_env",
    tableIdName: "region_env_id",
    tableUnitName: "region_env_name",
    tableGeomName: "region_geom",
    importedJson: envRegionJson,
    jsonRegionName: "REGION_NAME",
    isMultiPolygon: true,
  },
  {
    tableName: "lk_wildlife_management_unit",
    tableIdName: "wmu_id",
    tableUnitName: "wmu_name",
    tableGeomName: "wmu_geom",
    importedJson: wmuJson,
    jsonRegionName: "WILDLIFE_MGMT_UNIT_ID",
    isMultiPolygon: false,
  },
  {
    tableName: "lk_population_unit_temp",
    tableIdName: "population_unit_id",
    tableUnitName: "unit_name",
    tableGeomName: "unit_geom",
    importedJson: popUnitJson,
    jsonRegionName: "HERD_NAME",
    isMultiPolygon: true,
  },
];

/**
 * Seeds regions from JSON files.
 * Note: using raw SQL as PostGIS geometry types are not natively supported by prisma.
 * @async
 * @throws
 * @returns {Promise<void>}
 */
const seedRegions = async () => {
  console.log(`Seeding (${regionStructureList.length}) region JSON files...`);

  /**
   * Insert all region table values.
   * Need to do this all with raw SQL as the geometry types are not supported by prisma.
   */
  for (const struct of regionStructureList) {
    for (const region of struct.importedJson["features"]) {
      let nrRegionQuery = `INSERT INTO ${struct.tableName} (${struct.tableUnitName}, ${struct.tableGeomName}) VALUES `;
      const geom =
        struct.isMultiPolygon && region["geometry"]["type"] === "Polygon"
          ? {
              type: "MultiPolygon",
              coordinates: [region["geometry"]["coordinates"]],
              crs: { type: "name", properties: { name: "EPSG:4326" } },
            }
          : {
              ...region["geometry"],
              crs: { type: "name", properties: { name: "EPSG:4326" } },
            };
      const nrRegionValues = `('${
        region["properties"][
          struct.jsonRegionName as keyof (typeof region)["properties"]
        ]
      }', public.ST_GeomFromGeoJson('${JSON.stringify(geom)}'::jsonb))`;
      nrRegionQuery =
        nrRegionQuery +
        nrRegionValues +
        ` ON CONFLICT (${struct.tableIdName}) DO UPDATE SET ${struct.tableUnitName}=excluded.${struct.tableUnitName}`;
      await prisma.$queryRawUnsafe(nrRegionQuery);
    }
    await prisma.$queryRawUnsafe(`
            INSERT INTO ${struct.tableName} (${struct.tableUnitName}) VALUES ('Unknown')`);
  }
};

export { seedRegions };
