import { request } from "../../utils/constants";
import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocation,
  updateLocation,
} from "./location.service";

let locations: any;
let location: any;
let createdLocation: any;
let updatedLocation: any;

const ID = "42cfb108-99a5-4631-8385-1b43248ac502";
const COMMENT = "test location insert";

const data = {
  latitude: 1,
  longitude: 2,
  location_comment: "test location insert",
};

beforeAll(async () => {
  createdLocation = await createLocation(data);
  locations = await getAllLocations();
  location = await getLocation(createdLocation.location_id);
  updatedLocation = await updateLocation(
    { location_comment: "update" },
    createdLocation.location_id
  );
});
afterAll(async () => {
  // deleteLocation(createdLocation.location_id);
});
describe("API: Location", () => {
  describe("SERVICES", () => {
    describe("getAllLocations()", () => {
      it("returns array of locations", async () => {
        expect(locations.length).toBeGreaterThan(0);
      });
      it("location has location_id", async () => {
        expect(locations[0]).toHaveProperty("location_id");
      });
    });
    describe("getLocation()", () => {
      it("returns location", async () => {
        expect(location).not.toBeNull();
      });
      it("location has location_id", async () => {
        expect(locations[0]).toHaveProperty("location_id");
      });
    });
    describe("createLocation()", () => {
      it("creates location and returns new location", async () => {
        expect(createdLocation).not.toBeNull();
      });
      it("created location has location_id and new comment", async () => {
        expect(createdLocation).toHaveProperty("location_id");
        expect(createdLocation.location_comment).toBe(COMMENT);
      });
    });
    describe("updateLocation()", () => {
      it("updates an existing location data and returns new location", async () => {
        expect(updatedLocation).not.toBeNull();
        expect(updatedLocation.location_comment).toBe("update");
      });
      describe("deleteLocation()", () => {
        it("deletes location", async () => {
          const deletedLocation = await deleteLocation(
            createdLocation.location_id
          );
          expect(deletedLocation.location_id).toBe(createdLocation.location_id);
          expect(deletedLocation).not.toBeNull();
        });
      });
    });
  });
  describe("ROUTERS", () => {
    describe("GET /api/locations", () => {
      it("should return status 200 and array of locations", async () => {
        const res = await request.get("/api/locations");
        //expect(res.status).toBe(200);
        //expect(res.body.length).toBeGreaterThan(0);
      });
    });
  });
});
