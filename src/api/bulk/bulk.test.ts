import supertest from "supertest";
import {
  bulkCreateData as _bulkCreateData,
  bulkUpdateData as _bulkUpdateData,
  bulkErrMap,
} from "./bulk.service";
import { makeApp } from "../../app";
import { ICbDatabase } from "../../utils/database";
import { prisma } from "../../utils/constants";
import {
  capture,
  critter,
  critter_collection_unit,
  lk_taxon,
  marking,
  measurement_qualitative,
  measurement_quantitative,
  mortality,
  location,
} from "@prisma/client";
import { PrismaTransactionClient, apiError } from "../../utils/types";

const bulkCreateData = jest.fn();
const bulkUpdateData = jest.fn();
const updateCapture = jest.fn();
const updateMortality = jest.fn();
const appendEnglishTaxonAsUUID = jest.fn();
const appendEnglishMarkingsAsUUID = jest.fn();
const appendDefaultCOD = jest.fn();
const deleteMarking = jest.fn();
const deleteCollectionUnit = jest.fn();

const db = {
  bulkCreateData,
  bulkUpdateData,
  updateCapture,
  updateMortality,
  appendEnglishTaxonAsUUID,
  appendEnglishMarkingsAsUUID,
  appendDefaultCOD,
  deleteMarking,
  deleteCollectionUnit,
} as Record<keyof ICbDatabase, any>;

const request = supertest(makeApp(db));

const CRITTER_ID = "11084b96-5cbd-421e-8106-511ecfb51f7a";
const OTHER_CRITTER_ID = "27e2b7c9-2754-4286-9eb9-fd4f0a8378ef";
const WLH_ID = "12-1234";
const CRITTER: critter = {
  critter_id: CRITTER_ID,
  taxon_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
  wlh_id: WLH_ID,
  animal_id: "A13",
  sex: "Male",
  responsible_region_nr_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
  critter_comment: "Hi :)",
};

const TAXON: lk_taxon = {
  taxon_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
  kingdom_id: null,
  phylum_id: null,
  class_id: null,
  order_id: null,
  family_id: null,
  genus_id: null,
  species_id: null,
  sub_species_id: null,
  taxon_name_common: null,
  taxon_name_latin: "Caribou",
  spi_taxonomy_id: 0,
  taxon_description: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const OTHER_CRITTER: critter = {
  ...CRITTER,
  critter_id: OTHER_CRITTER_ID,
};

const MARKING: marking = {
  marking_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  critter_id: CRITTER_ID,
  capture_id: null,
  mortality_id: null,
  taxon_marking_body_location_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  marking_type_id: null,
  marking_material_id: null,
  primary_colour_id: null,
  secondary_colour_id: null,
  text_colour_id: null,
  identifier: null,
  frequency: null,
  frequency_unit: null,
  order: null,
  comment: null,
  attached_timestamp: new Date(),
  removed_timestamp: null,
  create_user: "",
  update_user: "",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const CAPTURE: capture = {
  capture_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  critter_id: CRITTER_ID,
  capture_location_id: null,
  release_location_id: null,
  capture_timestamp: new Date(),
  release_timestamp: null,
  capture_comment: null,
  release_comment: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const MORTALITY: mortality = {
  mortality_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  critter_id: CRITTER_ID,
  location_id: null,
  mortality_timestamp: new Date(),
  proximate_cause_of_death_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  proximate_cause_of_death_confidence: null,
  proximate_predated_by_taxon_id: null,
  ultimate_cause_of_death_id: null,
  ultimate_cause_of_death_confidence: null,
  ultimate_predated_by_taxon_id: null,
  mortality_comment: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const QUALITATIVE: measurement_qualitative = {
  measurement_qualitative_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  critter_id: CRITTER_ID,
  taxon_measurement_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
  capture_id: null,
  mortality_id: null,
  qualitative_option_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  measurement_comment: null,
  measured_timestamp: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const QUANTITATIVE: measurement_quantitative = {
  measurement_quantitative_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  critter_id: CRITTER_ID,
  taxon_measurement_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  capture_id: null,
  mortality_id: null,
  value: 0,
  measurement_comment: null,
  measured_timestamp: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const DEFAULTFORMAT_CRITTER = {
  ...CRITTER,
  lk_taxon: {
    taxon_name_common: "Caribou",
    taxon_name_latin: "Rangifer tarandus",
  },
  lk_region_nr: {
    region_nr_name: "Somewhere",
  },
  critter_collection_unit: [
    {
      xref_collection_unit: {
        lk_collection_category: {
          category_name: "name",
          collection_category_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
        },
        unit_name: "name",
        unit_description: "desc",
      },
    },
  ],
  mortality: [MORTALITY],
};

const COLLECTION: critter_collection_unit = {
  critter_collection_unit_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  critter_id: CRITTER_ID,
  collection_unit_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const LOCATION: location = {
  location_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  latitude: 2,
  longitude: 2,
  coordinate_uncertainty: null,
  coordinate_uncertainty_unit: null,
  wmu_id: null,
  region_nr_id: null,
  region_env_id: null,
  elevation: null,
  temperature: null,
  location_comment: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const DETAILEDFORMAT_CRITTER = {
  ...DEFAULTFORMAT_CRITTER,
  user_critter_create_userTouser: {
    system_name: "CRITTERBASE",
  },
  capture: [CAPTURE],
  mortality: [MORTALITY],
  marking: [MARKING],
  measurement_qualitative: [QUALITATIVE],
  measurement_quantitative: [QUANTITATIVE],
};

const prismaMock = {
  critter: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    update: jest.fn(),
  },
  capture: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
  mortality: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
  marking: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    delete: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  location: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    delete: jest.fn(),
    update: jest.fn(),
  },
  critter_collection_unit: {
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
    create: jest.fn(),
    update: jest.fn(),
  },
  measurement_quantitative: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  measurement_qualitative: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  family: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  family_child: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  family_parent: {
    createMany: jest.fn().mockResolvedValue({ count: 1 })
  }
};
jest
  .spyOn(prisma, "$transaction")
  .mockImplementation((callback) =>
    callback(prismaMock as unknown as PrismaTransactionClient)
  );

describe("API: Bulk", () => {
  describe("SERVICES", () => {
    describe("bulkCreateData()", () => {
      it("should insert critters, collections, locations, captures, mortalityies, markings", async () => {
        prismaMock.critter.createMany.mockResolvedValue({ count: 1 });
        prismaMock.capture.createMany.mockResolvedValue({ count: 1 });
        prismaMock.mortality.createMany.mockResolvedValue({ count: 1 });
        prismaMock.location.createMany.mockResolvedValue({ count: 1 });
        prismaMock.marking.createMany.mockResolvedValue({ count: 1 });
        prismaMock.critter_collection_unit.createMany.mockResolvedValue({
          count: 1,
        });
        prismaMock.measurement_qualitative.createMany.mockResolvedValue({ count: 1});
        const result = await _bulkCreateData({
          critters: [CRITTER],
          collections: [COLLECTION],
          locations: [LOCATION],
          captures: [CAPTURE],
          mortalities: [MORTALITY],
          markings: [MARKING],
          quantitative_measurements: [],
          qualitative_measurements: [],
          families: [],
          family_parents: [],
          family_children: []
        });
        expect.assertions(6);
        expect(prismaMock.critter.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.capture.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.mortality.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.location.createMany.mock.calls.length).toBe(1);
        expect(prismaMock.marking.createMany.mock.calls.length).toBe(1);
        expect(
          prismaMock.critter_collection_unit.createMany.mock.calls.length
        ).toBe(1);
      });
    });

    describe("bulkUpdateData()", () => {
      it("should update critters, collections, locations, captures, mortalityies, markings", async () => {
        prismaMock.critter.update.mockResolvedValue(CRITTER);
        prismaMock.marking.update.mockResolvedValue(MARKING);
        prismaMock.location.update.mockResolvedValue(LOCATION);
        prismaMock.critter_collection_unit.update.mockResolvedValue(COLLECTION);
        updateCapture.mockResolvedValue(CAPTURE);
        updateMortality.mockResolvedValue(MORTALITY);

        const result = await _bulkUpdateData(
          {
            critters: [CRITTER],
            collections: [COLLECTION],
            locations: [LOCATION],
            captures: [CAPTURE],
            mortalities: [MORTALITY],
            markings: [MARKING],
            _deleteMarkings: [],
            _deleteUnits: [],
          },
          db
        );

        expect.assertions(6);
        expect(prismaMock.critter.update.mock.calls.length).toBe(1);
        expect(prismaMock.marking.update.mock.calls.length).toBe(1);
        expect(prismaMock.location.update.mock.calls.length).toBe(1);
        expect(
          prismaMock.critter_collection_unit.update.mock.calls.length
        ).toBe(1);
        expect(updateCapture.mock.calls.length).toBe(1);
        expect(updateMortality.mock.calls.length).toBe(1);
      });
      it("should error out on missing capture id", async () => {
        expect.assertions(1);
        await expect(
          async () =>
            await _bulkUpdateData(
              {
                critters: [],
                collections: [],
                locations: [],
                mortalities: [],
                markings: [],
                captures: [{ capture_comment: "a" }],
                _deleteMarkings: [],
                _deleteUnits: [],
              },
              db
            )
        ).rejects.toThrow(apiError.requiredProperty("capture_id"));
      });
      it("should error out on missing mortality id", async () => {
        expect.assertions(1);
        await expect(
          async () =>
            await _bulkUpdateData(
              {
                critters: [],
                collections: [],
                locations: [],
                mortalities: [{ mortality_comment: "a" }],
                markings: [],
                captures: [],
                _deleteMarkings: [],
                _deleteUnits: [],
              },
              db
            )
        ).rejects.toThrow(apiError.requiredProperty("mortality_id"));
      });
      it("should create marking instead of update marking if id is missing", async () => {
        expect.assertions(1);
        prismaMock.marking.create.mockResolvedValue(MARKING);
        await _bulkUpdateData(
          {
            critters: [],
            collections: [],
            locations: [],
            mortalities: [],
            markings: [
              {
                critter_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
                taxon_marking_body_location_id:
                  "98f9fede-95fc-4321-9444-7c2742e336fe",
              },
            ],
            captures: [],
            _deleteMarkings: [],
            _deleteUnits: [],
          },
          db
        );
        expect(prismaMock.marking.create.mock.calls.length).toBe(1);
      });
      it("should delete marking if included in _deleteMarkings", async () => {
        expect.assertions(2);
        prismaMock.marking.delete.mockResolvedValue(MARKING);
        await _bulkUpdateData(
          {
            critters: [],
            collections: [],
            locations: [],
            mortalities: [],
            markings: [],
            captures: [],
            _deleteMarkings: [
              {
                marking_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
                _delete: true,
              },
            ],
            _deleteUnits: [
              {
                critter_collection_unit_id:
                  "98f9fede-95fc-4321-9444-7c2742e336fe",
                _delete: true,
              },
            ],
          },
          db
        );
        expect(deleteMarking.mock.calls.length).toBe(1);
        expect(deleteCollectionUnit.mock.calls.length).toBe(1);
      });
      it("should create a new collection unit when a critter_id is provided but no primary key", async () => {
        expect.assertions(1);
        await _bulkUpdateData(
          {
            critters: [],
            collections: [
              {
                critter_id: CRITTER_ID,
                collection_unit_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
              },
            ],
            locations: [],
            mortalities: [],
            markings: [],
            captures: [],
            _deleteMarkings: [],
            _deleteUnits: [],
          },
          db
        );
        expect(
          prismaMock.critter_collection_unit.create.mock.calls.length
        ).toBe(1);
      });
    });

    describe("bulkErrMap()", () => {
      it("should return a formatted error message", () => {
        const msg = bulkErrMap(
          {
            code: "invalid_type",
            path: ["string"],
            expected: "string",
            received: "number",
          },
          {
            defaultError: "",
            data: undefined,
          },
          "critters"
        );
        expect.assertions(1);
        expect(typeof msg.message).toBe("string");
      });
    });
  });

  describe("ROUTER", () => {
    describe("POST /api/bulk", () => {
      it("should return status 201", async () => {
        appendEnglishTaxonAsUUID.mockResolvedValue({ ...CRITTER });
        appendEnglishMarkingsAsUUID.mockResolvedValue({ ...MARKING });
        appendDefaultCOD.mockResolvedValue({ ...MORTALITY });
        const body = {
          critters: [CRITTER],
          collections: [COLLECTION],
          locations: [LOCATION],
          captures: [CAPTURE],
          mortalities: [MORTALITY],
          markings: [MARKING],
          quantitative_measurements: [],
          qualitative_measurements: [],
          families: {families: [], parents: [], children: []}
        };
        const res = await request.post("/api/bulk").send(body);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });
      it("should return status 201", async () => {
        const body = {};
        const res = await request.post("/api/bulk").send(body);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });
    });
    describe("PATCH /api/bulk", () => {
      it("should return status 200", async () => {
        const body = {
          critters: [CRITTER],
          collections: [COLLECTION, { ...COLLECTION, _delete: true }],
          locations: [LOCATION],
          captures: [CAPTURE],
          mortalities: [MORTALITY],
          markings: [MARKING, { ...MARKING, _delete: true }],
        };
        const res = await request.patch("/api/bulk").send(body);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it("should return status 200", async () => {
        const body = {};
        const res = await request.patch("/api/bulk").send(body);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it("should return status 400, trigger errors", async () => {
        expect.assertions(6);
        const body = {
          critters: [{ critter_id: 2 }],
        };
        let res = await request.patch("/api/bulk").send(body);
        expect(res.status).toBe(400);

        const body2 = {
          collections: [{ critter_id: 2 }],
        };
        res = await request.patch("/api/bulk").send(body2);
        expect(res.status).toBe(400);

        const body3 = {
          locations: [{ location_id: 2 }],
        };
        res = await request.patch("/api/bulk").send(body3);
        expect(res.status).toBe(400);

        const body4 = {
          captures: [{ capture_id: 2 }],
        };
        res = await request.patch("/api/bulk").send(body4);
        expect(res.status).toBe(400);

        const body5 = {
          mortalities: [{ mortality_id: 2 }],
        };
        res = await request.patch("/api/bulk").send(body5);
        expect(res.status).toBe(400);

        const body6 = {
          mortalities: [{ mortality_id: 2 }],
        };
        res = await request.patch("/api/bulk").send(body6);
        expect(res.status).toBe(400);
      });
    });
  });
});
