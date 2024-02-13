import { sex } from "@prisma/client";
import { prisma } from "../../src/utils/constants";
import { ITIS_TSN } from "./seed_constants";

export const seedCritters = async () => {
  const caribouRegion = await prisma.lk_region_nr.findFirst({
    where: { region_nr_name: "Cariboo Natural Resource Region" },
  });

  if (!caribouRegion) {
    throw new Error("Cariboo natural resource region not found");
  }

  const carl = await prisma.critter.create({
    data: {
      wlh_id: "1234-56",
      animal_id: "Carl",
      sex: sex.Male,
      itis_tsn: ITIS_TSN.CARIBOU,
      responsible_region_nr_id: caribouRegion.region_nr_id,
    },
  });

  const carlita = await prisma.critter.create({
    data: {
      wlh_id: "3456-78",
      animal_id: "Carlita",
      sex: sex.Female,
      itis_tsn: ITIS_TSN.CARIBOU,
      responsible_region_nr_id: caribouRegion.region_nr_id,
    },
  });

  // const locations = await prisma.location.createMany({
  //   data: [
  //     {
  //       latitude: 1,
  //       longitude: 2,
  //       coordinate_uncertainty: 10,
  //       coordinate_uncertainty_unit: "m",
  //       elevation: 100,
  //       temperature: 20,
  //       location_comment: "Animal captured here",
  //     },
  //     {
  //       latitude: 3,
  //       longitude: 4,
  //       coordinate_uncertainty: 10,
  //       coordinate_uncertainty_unit: "m",
  //       elevation: 100,
  //       temperature: 20,
  //       location_comment: "Animal released here",
  //     },
  //   ],
  // });

  // await prisma.capture.create({
  //   data: {
  //     critter_id: carl.critter_id,
  //     capture_timestamp: new Date(),
  //     release_timestamp: new Date(),
  //     capture_comment: "Captured Carl",
  //     release_comment: "Released Carl",
  //   },
  // });

  // Handle additional attributes
};
