import { prisma, request } from "../../utils/constants";

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
const COMMENT = "insert";
const UPDATE = "update";
const ROUTE = "/api/locations";

const data = {
  latitude: 1,
  longitude: 2,
  location_comment: COMMENT,
};

beforeAll(async () => {
  createdLocation = await createLocation(data);
  locations = await getAllLocations();
  location = await getLocation(createdLocation.location_id);
  updatedLocation = await updateLocation(
    { location_comment: UPDATE },
    createdLocation.location_id
  );
});
afterAll(async () => {
  await prisma.location.deleteMany({
    where: { location_comment: UPDATE || COMMENT },
  });
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
      it("non existing location_id returns null", async () => {
        const notFound = await getLocation(
          "52cfb108-99a5-4631-8385-1b43248ac502"
        );
        expect(notFound).toBeNull();
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
        expect(updatedLocation.location_comment).toBe(UPDATE);
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
    describe(`GET ${ROUTE}`, () => {
      it("should return status 200 ", async () => {
        const res = await request.get(ROUTE);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
      });
      it("should return array of locations ", async () => {
        const res = await request.get(ROUTE);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0].location_id).toBeDefined();
      });
    });

    describe(`POST ${ROUTE}/create`, () => {
      it("returns status 201 with valid body in req", async () => {
        const res = await request.post(`${ROUTE}/create`).send(data);
        createdLocation = res.body;
        expect(res.status).toBe(201);
        expect(res.body.location_comment).toBe(COMMENT);
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${ROUTE}/create`)
          .send({ latitude: "1", location_comment: COMMENT });
        expect(res.status).toBe(400);
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
      });
    });

    describe(`GET ${ROUTE}/:id`, () => {
      it("should return status 200 and location", async () => {
        const res = await request.get(
          `${ROUTE}/${createdLocation.location_id}`
        );
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
      });
    });

    describe(`PATCH ${ROUTE}/:id`, () => {
      it("returns status 201 and updates a valid field", async () => {
        const res = await request
          .patch(`${ROUTE}/${createdLocation.location_id}`)
          .send({ location_comment: UPDATE });
        createdLocation = res.body;
        expect(res.status).toBe(201);
        expect(res.body.location_comment).toBe(UPDATE);
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .patch(`${ROUTE}/${createdLocation.location_id}`)
          .send({ extra_property: "false" });
        expect(res.status).toBe(400);
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .patch(`${ROUTE}/${createdLocation.location_id}`)
          .send({ latitude: "1" });
        expect(res.status).toBe(400);
      });
    });
  });
});
