import { prisma } from "../../utils/constants";
import {
  getAllQualMeasurements,
  getQualMeasurement,
} from "./qualitative.service";

let numMeasurements = 0;
let measurements: any;
let measurement: any;
beforeAll(async () => {
  //measurement = await getQualMeasurement();
  measurements = await getAllQualMeasurements();
  numMeasurements = await prisma.measurement_qualitative.count();
});

describe("API: Location", () => {
  describe("SERVICES", () => {
    describe("qualitative.service.ts", () => {
      describe("getAllQualMeasurements()", () => {
        it("returns array of qualitative measurements", async () => {
          expect(measurements).toBeInstanceOf(Array);
        });
        it("first item has qualitative_measurement_id or [] returned", async () => {
          if (measurements?.length) {
            expect(measurements[0]).toHaveProperty(
              "measurement_qualitative_id"
            );
          } else {
            expect(measurements).toBe([]);
          }
        });
      });
      describe("getQualMeasurement()", () => {
        // it("returns object with qualitative_measurement_id or null", async () => {
        //   if (measurement) {
        //     expect(measurement).toHaveProperty("measurement_qualitative_id");
        //   } else {
        //     expect(measurements).toBe([]);
        //   }
        // });
      });
    });

    // describe("getAllLocations()", () => {
    //   it("returns array of locations", async () => {
    //     expect(locations.length).toBeGreaterThan(0);
    //   });
    //   it("location has location_id", async () => {
    //     expect(locations[0]).toHaveProperty("location_id");
    //   });
    // });
    // describe("getLocation()", () => {
    //   it("returns location", async () => {
    //     expect(location).not.toBeNull();
    //   });
    //   it("location has location_id", async () => {
    //     expect(locations[0]).toHaveProperty("location_id");
    //   });
    //   it("non existing location_id returns null", async () => {
    //     const notFound = await getLocation(
    //       "52cfb108-99a5-4631-8385-1b43248ac502"
    //     );
    //     expect(notFound).toBeNull();
    //   });
    // });
    // describe("createLocation()", () => {
    //   it("creates location and returns new location", async () => {
    //     expect(createdLocation).not.toBeNull();
    //   });
    //   it("created location has location_id and new comment", async () => {
    //     expect(createdLocation).toHaveProperty("location_id");
    //     expect(createdLocation.location_comment).toBe(COMMENT);
    //   });
    // });
    // describe("updateLocation()", () => {
    //   it("updates an existing location data and returns new location", async () => {
    //     expect(updatedLocation).not.toBeNull();
    //     expect(updatedLocation.location_comment).toBe(UPDATE);
    //   });
    //   describe("deleteLocation()", () => {
    //     it("deletes location", async () => {
    //       const deletedLocation = await deleteLocation(
    //         createdLocation.location_id
    //       );
    //       expect(deletedLocation.location_id).toBe(createdLocation.location_id);
    //       expect(deletedLocation).not.toBeNull();
    //     });
    //   });
  });
  describe("CLEANUP", () => {
    it("same number of initial measurements", async () => {
      const afterTestsNumMeasurements =
        await prisma.measurement_qualitative.count();
      expect(numMeasurements).toBe(afterTestsNumMeasurements);
    });
  });
});
