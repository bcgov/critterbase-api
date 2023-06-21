import {
  capture,
  critter,
  lk_taxon,
  marking,
  measurement_qualitative,
  measurement_quantitative,
  mortality,
} from "@prisma/client";
import { prisma } from "../../utils/constants";
import {
  createCritter as _createCritter,
  deleteCritter as _deleteCritter,
  getAllCritters as _getAllCritters,
  getCritterById as _getCritterById,
  getCritterByWlhId as _getCritterByWlhId,
  updateCritter as _updateCritter,
  getMultipleCrittersByIds as _getMultipleCrittersByIds,
  getSimilarCritters as _getSimilarCritters,
  formatLocationNameSearch as _formatLocationNameSearch,
  appendEnglishTaxonAsUUID as _appendEnglishTaxonAsUUID,
} from "./critter.service";
import { randomUUID } from "crypto";
import { makeApp } from "../../app";
import supertest from "supertest";
import { ICbDatabase } from "../../utils/database";
import {
  CritterDefaultResponseSchema,
  CritterDetailedResponseSchema,
  CritterSchema,
  CritterUpdateSchema,
} from "./critter.utils";
import { QueryFormats, apiError } from "../../utils/types";

const getAllCritters = jest.fn();
const getMultipleCrittersByIds = jest.fn();
const getCritterById = jest.fn();
const getCritterByWlhId = jest.fn();
const updateCritter = jest.fn();
const createCritter = jest.fn();
const getSimilarCritters = jest.fn();
const deleteCritter = jest.fn();
const appendEnglishTaxonAsUUID = jest.fn();

const request = supertest(
  makeApp({
    getAllCritters,
    getMultipleCrittersByIds,
    getCritterById,
    getCritterByWlhId,
    updateCritter,
    createCritter,
    getSimilarCritters,
    deleteCritter,
    appendEnglishTaxonAsUUID,
  } as Record<keyof ICbDatabase, any>)
);

const create = jest.spyOn(prisma.critter, "create").mockImplementation();
const update = jest.spyOn(prisma.critter, "update").mockImplementation();
const findMany = jest.spyOn(prisma.critter, "findMany").mockImplementation();
const findUniqueOrThrow = jest
  .spyOn(prisma.critter, "findUniqueOrThrow")
  .mockImplementation();
const pDelete = jest.spyOn(prisma.critter, "delete").mockImplementation();
const markingFindMany = jest
  .spyOn(prisma.marking, "findMany")
  .mockImplementation();
const captureFindMany = jest
  .spyOn(prisma.capture, "findMany")
  .mockImplementation();
const mortalityFindMany = jest
  .spyOn(prisma.mortality, "findMany")
  .mockImplementation();
const taxonFindMany = jest
  .spyOn(prisma.lk_taxon, "findMany")
  .mockImplementation();
const taxonFindFirst = jest
  .spyOn(prisma.lk_taxon, "findFirst")
  .mockImplementation();

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

beforeEach(() => {
  getAllCritters.mockReset();
  getMultipleCrittersByIds.mockReset();
  getCritterById.mockReset();
  getCritterByWlhId.mockReset();
  updateCritter.mockReset();
  createCritter.mockReset();
  getSimilarCritters.mockReset();
  deleteCritter.mockReset();

  // getAllCritters.mockResolvedValue(Promise.resolve([DEFAULTFORMAT_CRITTER]));
  getAllCritters.mockImplementation(() => {
    return [DEFAULTFORMAT_CRITTER];
  });
  getCritterById.mockImplementation(() => {
    return DEFAULTFORMAT_CRITTER;
  });
  getCritterByWlhId.mockImplementation(() => {
    return [DEFAULTFORMAT_CRITTER];
  });

  createCritter.mockImplementation(() => {
    return DEFAULTFORMAT_CRITTER;
  });

  deleteCritter.mockImplementation(() => {
    return DEFAULTFORMAT_CRITTER;
  });

  getMultipleCrittersByIds.mockImplementation(() => {
    return [DEFAULTFORMAT_CRITTER];
  });

  getSimilarCritters.mockImplementation(() => {
    return [DEFAULTFORMAT_CRITTER];
  });

  appendEnglishTaxonAsUUID.mockImplementation(() => {
    return { ...CRITTER, taxon_id: TAXON.taxon_id };
  });
});

describe("API: Critter", () => {
  describe("UTILS", () => {
    describe("CritterDetailedResponseSchema", () => {
      it("should correctly parse the object", async () => {
        const parsed = CritterDetailedResponseSchema.parse(
          DETAILEDFORMAT_CRITTER
        );
        expect.assertions(5);
        expect(parsed.taxon).toBeDefined();
        expect(parsed.responsible_region).toBeDefined();
        expect(parsed.measurement).toBeInstanceOf(Object);
        expect(parsed.measurement.qualitative).toBeInstanceOf(Array);
        expect(parsed.measurement.quantitative).toBeInstanceOf(Array);
      });
      it("should handle the case where lk_region_nr is missing", async () => {
        const { lk_region_nr, ...rest } = DETAILEDFORMAT_CRITTER;
        const parsed = CritterDetailedResponseSchema.parse({ ...rest });
        expect(parsed.responsible_region).toBeUndefined();
      });
      it("should handle the case where there is only taxon_name_latin available", async () => {
        const { lk_taxon, ...rest } = DETAILEDFORMAT_CRITTER;
        const parsed = CritterDetailedResponseSchema.parse({
          ...rest,
          lk_taxon: { taxon_name_latin: "Ranger tarandus" },
        });
        expect(parsed.taxon).toBe("Ranger tarandus");
      });
      it("should handle the case where there is no mortality", async () => {
        const { mortality, ...rest } = DETAILEDFORMAT_CRITTER;
        const parsed = CritterDetailedResponseSchema.parse({
          ...rest,
          mortality: [],
        });
        expect(parsed.mortality_timestamp).toBeNull();
      });
    });
    describe("CritterDefaultResponseSchema", () => {
      it("should correctly parse the object", async () => {
        const parsed = CritterDefaultResponseSchema.parse(
          DEFAULTFORMAT_CRITTER
        );
        expect.assertions(3);
        expect(parsed.taxon).toBeDefined();
        expect(parsed.collection_units).toBeInstanceOf(Array);
        expect(parsed.mortality_timestamp).toBeInstanceOf(Date);
      });
      it("should handle the case where only taxon_name_latin is available", async () => {
        const { lk_taxon, ...rest } = DEFAULTFORMAT_CRITTER;
        const parsed = CritterDefaultResponseSchema.parse({
          ...rest,
          lk_taxon: { taxon_name_latin: "Ranger tarandus" },
        });
        expect(parsed.taxon).toBe("Ranger tarandus");
      });
      it("should handle the case where there is no mortality", async () => {
        const { mortality, ...rest } = DEFAULTFORMAT_CRITTER;
        const parsed = CritterDefaultResponseSchema.parse({
          ...rest,
          mortality: [],
        });
        expect(parsed.mortality_timestamp).toBeNull();
      });
    });
  });
  describe("SERVICES", () => {
    describe("createCritter", () => {
      it("creates a critter", async () => {
        create.mockResolvedValue(DEFAULTFORMAT_CRITTER);
        const returnedCritter = await _createCritter(CRITTER);
        expect.assertions(2);
        expect(prisma.critter.create).toHaveBeenCalled();
        expect(
          CritterDefaultResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
      });
      it("creates a critter, detailed foramt", async () => {
        create.mockResolvedValue(DETAILEDFORMAT_CRITTER);
        const returnedCritter = await _createCritter(
          CRITTER,
          QueryFormats.detailed
        );
        expect.assertions(2);
        expect(prisma.critter.create).toHaveBeenCalled();
        expect(
          CritterDetailedResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
      });
      it("creates a critter", async () => {
        create.mockResolvedValue(CRITTER);
        const returnedCritter = await _createCritter(
          CRITTER,
          QueryFormats.asSelect
        );
        expect.assertions(2);
        expect(prisma.critter.create).toHaveBeenCalled();
        expect(returnedCritter["lk_taxon"]).toBeUndefined();
      });
      it("fails to create a critter", async () => {
        create.mockRejectedValue(new Error());
        await expect(_createCritter(CRITTER)).rejects.toThrow();
      });
    });
    describe("getAllCritters()", () => {
      it("returns many critters", async () => {
        findMany.mockResolvedValue([DEFAULTFORMAT_CRITTER]);
        const returnedCritter = await _getAllCritters();
        expect.assertions(4);
        expect(prisma.critter.findMany).toHaveBeenCalled();
        expect(returnedCritter).toBeInstanceOf(Array);
        expect(returnedCritter.length).toBe(1);
        expect(
          CritterDefaultResponseSchema.safeParse(returnedCritter[0]).success
        ).toBe(true);
      });
      it("test the detailed format case", async () => {
        findMany.mockResolvedValue([DETAILEDFORMAT_CRITTER]);
        const returnedCritter = await _getAllCritters(QueryFormats.detailed);
        expect.assertions(4);
        expect(prisma.critter.findMany).toHaveBeenCalled();
        expect(returnedCritter).toBeInstanceOf(Array);
        expect(returnedCritter.length).toBe(1);
        expect(
          CritterDetailedResponseSchema.safeParse(returnedCritter[0]).success
        ).toBe(true);
      });
      it("tests the case where no prisma include is available", async () => {
        findMany.mockResolvedValue([CRITTER]);
        const returnedCritter = await _getAllCritters(QueryFormats.asSelect);
        expect.assertions(2);
        expect(prisma.critter.findMany).toHaveBeenCalled();
        expect(returnedCritter[0]["lk_taxon"]).toBeUndefined();
      });
    });
    describe("getCritterById()", () => {
      it("returns a critter by ID", async () => {
        findUniqueOrThrow.mockResolvedValue(DEFAULTFORMAT_CRITTER);
        const returnedCritter = await _getCritterById(CRITTER_ID);
        expect.assertions(2);
        expect(
          CritterDefaultResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
        expect(prisma.critter.findUniqueOrThrow).toHaveBeenCalled();
      });
      it("returnes a critter by ID, detailed format", async () => {
        findUniqueOrThrow.mockResolvedValue(DETAILEDFORMAT_CRITTER);
        const returnedCritter = await _getCritterById(
          CRITTER_ID,
          QueryFormats.detailed
        );
        expect.assertions(2);
        expect(
          CritterDetailedResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
        expect(prisma.critter.findUniqueOrThrow).toHaveBeenCalled();
      });
      it("returnes a critter by ID, no prisma include", async () => {
        findUniqueOrThrow.mockResolvedValue(CRITTER);
        const returnedCritter = await _getCritterById(
          CRITTER_ID,
          QueryFormats.asSelect
        );
        expect.assertions(2);
        expect(returnedCritter["lk_taxon"]).toBeUndefined();
        expect(prisma.critter.findUniqueOrThrow).toHaveBeenCalled();
      });
    });
    describe("getCritterByWlhId(wlh_id: string)", () => {
      it("returns a critter by wlh_id", async () => {
        findMany.mockResolvedValue([DEFAULTFORMAT_CRITTER]);
        const returnedCritter = await _getCritterByWlhId(WLH_ID);
        expect.assertions(2);
        expect(
          CritterDefaultResponseSchema.safeParse(returnedCritter[0]).success
        ).toBe(true);
        expect(prisma.critter.findMany).toHaveBeenCalled();
      });
      it("returns a critter by wlh_id, detailed format", async () => {
        findMany.mockResolvedValue([DETAILEDFORMAT_CRITTER]);
        const returnedCritter = await _getCritterByWlhId(
          WLH_ID,
          QueryFormats.detailed
        );
        expect.assertions(2);
        expect(
          CritterDetailedResponseSchema.safeParse(returnedCritter[0]).success
        ).toBe(true);
        expect(prisma.critter.findMany).toHaveBeenCalled();
      });
      it("returns a critter by wlh_id", async () => {
        findMany.mockResolvedValue([CRITTER]);
        const returnedCritter = await _getCritterByWlhId(
          WLH_ID,
          QueryFormats.asSelect
        );
        expect.assertions(2);
        expect(returnedCritter[0]["lk_taxon"]).toBeUndefined();
        expect(prisma.critter.findMany).toHaveBeenCalled();
      });
    });
    describe("updateCritter()", () => {
      it("updates a critter with the body provided", async () => {
        update.mockResolvedValue(DEFAULTFORMAT_CRITTER);
        const returnedCritter = await _updateCritter(CRITTER_ID, CRITTER);
        expect.assertions(2);
        expect(prisma.critter.update).toHaveBeenCalled();
        expect(
          CritterDefaultResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
      });
      it("updates a critter with the body provided", async () => {
        update.mockResolvedValue(DETAILEDFORMAT_CRITTER);
        const returnedCritter = await _updateCritter(
          CRITTER_ID,
          CRITTER,
          QueryFormats.detailed
        );
        expect.assertions(2);
        expect(prisma.critter.update).toHaveBeenCalled();
        expect(
          CritterDetailedResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
      });
      it("updates a critter with the body provided", async () => {
        update.mockResolvedValue(CRITTER);
        const returnedCritter = await _updateCritter(
          CRITTER_ID,
          CRITTER,
          QueryFormats.asSelect
        );
        expect.assertions(2);
        expect(prisma.critter.update).toHaveBeenCalled();
        expect(returnedCritter["lk_taxon"]).toBeUndefined();
      });
    });
    describe("deleteCritter()", () => {
      it("should delete a critter", async () => {
        pDelete.mockResolvedValue(DEFAULTFORMAT_CRITTER);
        const returnedCritter = await _deleteCritter(CRITTER_ID);
        expect.assertions(2);
        expect(prisma.critter.delete).toHaveBeenCalled();
        expect(
          CritterDefaultResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
      });
      it("should delete a critter, detailed format", async () => {
        pDelete.mockResolvedValue(DETAILEDFORMAT_CRITTER);
        const returnedCritter = await _deleteCritter(
          CRITTER_ID,
          QueryFormats.detailed
        );
        expect.assertions(2);
        expect(prisma.critter.delete).toHaveBeenCalled();
        expect(
          CritterDetailedResponseSchema.safeParse(returnedCritter).success
        ).toBe(true);
      });
      it("should delete a critter, no prisma include", async () => {
        pDelete.mockResolvedValue(CRITTER);
        const returnedCritter = await _deleteCritter(
          CRITTER_ID,
          QueryFormats.asSelect
        );
        expect.assertions(2);
        expect(prisma.critter.delete).toHaveBeenCalled();
        expect(returnedCritter["lk_taxon"]).toBeUndefined();
      });
    });
    describe("getMultipleCrittersByIds()", () => {
      it("should return critters matching the given ids", async () => {
        findMany.mockResolvedValue([
          DEFAULTFORMAT_CRITTER,
          { ...DEFAULTFORMAT_CRITTER, ...OTHER_CRITTER },
        ]);
        const returnedCritters = await _getMultipleCrittersByIds({
          critter_ids: [CRITTER_ID, OTHER_CRITTER_ID],
        });
        expect.assertions(4);
        expect(prisma.critter.findMany).toHaveBeenCalled();
        expect(returnedCritters).toBeInstanceOf(Array);
        expect(returnedCritters.length).toBe(2);
        expect(returnedCritters[0]["lk_taxon"]).toBeDefined();
      });
      it("should return critters matching the given ids", async () => {
        findMany.mockResolvedValue([DETAILEDFORMAT_CRITTER]);
        const returnedCritters = await _getMultipleCrittersByIds(
          { critter_ids: [CRITTER_ID] },
          QueryFormats.detailed
        );
        expect.assertions(4);
        expect(prisma.critter.findMany).toHaveBeenCalled();
        expect(returnedCritters).toBeInstanceOf(Array);
        expect(returnedCritters.length).toBe(1);
        expect(returnedCritters[0]["marking"]).toBeDefined();
      });
      it("should handle the case where no prisma include is available", async () => {
        findMany.mockResolvedValue([CRITTER, OTHER_CRITTER]);
        const returnedCritters = await _getMultipleCrittersByIds(
          { critter_ids: [CRITTER_ID, OTHER_CRITTER_ID] },
          QueryFormats.asSelect
        );
        expect.assertions(3);
        expect(prisma.critter.findMany).toHaveBeenCalled();
        expect(returnedCritters).toBeInstanceOf(Array);
        expect(returnedCritters[0]["taxon"]).toBeUndefined();
      });
    });
    describe("getSimilarCritters()", () => {
      it("should return critters by their wlh_id, with various formatting", async () => {
        findMany.mockResolvedValue([DEFAULTFORMAT_CRITTER]);
        const returnedCritters = await _getSimilarCritters({
          critter: { wlh_id: WLH_ID },
        });
        expect.assertions(3);
        expect(
          CritterDefaultResponseSchema.safeParse(returnedCritters[0]).success
        ).toBe(true);

        findMany.mockResolvedValue([DETAILEDFORMAT_CRITTER]);
        const returnedCritters2 = await _getSimilarCritters(
          { critter: { wlh_id: WLH_ID } },
          QueryFormats.detailed
        );
        expect(
          CritterDetailedResponseSchema.safeParse(returnedCritters2[0]).success
        ).toBe(true);

        findMany.mockResolvedValue([CRITTER]);
        const returnedCritters3 = await _getSimilarCritters(
          { critter: { wlh_id: WLH_ID } },
          QueryFormats.asSelect
        );
        expect(returnedCritters3[0]["lk_taxon"]).toBeUndefined();
      });
      it("should return critters by their wlh_id, taxon", async () => {
        findMany.mockResolvedValue([DEFAULTFORMAT_CRITTER]);
        const returnedCritters = await _getSimilarCritters({
          critter: {
            wlh_id: WLH_ID,
            taxon_name_common: "Rangifer tarandus",
            taxon_name_latin: "Caribou",
          },
        });
        expect.assertions(9);
        expect(prisma.critter.findMany).toHaveBeenCalledTimes(2);
        expect(returnedCritters).toBeInstanceOf(Array);
        expect(returnedCritters.length).toBe(1);
        const returnedCritters2 = await _getSimilarCritters({
          critter: { wlh_id: WLH_ID, taxon_name_common: "Rangifer tarandus" },
        });
        expect(prisma.critter.findMany).toHaveBeenCalledTimes(4);
        expect(returnedCritters2).toBeInstanceOf(Array);
        expect(returnedCritters2.length).toBe(1);
        const returnedCritters3 = await _getSimilarCritters({
          critter: { wlh_id: WLH_ID, taxon_name_latin: "Caribou" },
        });
        expect(prisma.critter.findMany).toHaveBeenCalledTimes(6);
        expect(returnedCritters3).toBeInstanceOf(Array);
        expect(returnedCritters3.length).toBe(1);
      });
      it("should return critters based off marking and critter detail", async () => {
        findMany.mockResolvedValue([DEFAULTFORMAT_CRITTER]);
        markingFindMany.mockResolvedValue([MARKING]);
        const returnedCritters = await _getSimilarCritters({
          critter: { wlh_id: WLH_ID },
          markings: [{ primary_colour: "Red" }],
        });
        expect.assertions(4);
        expect(prisma.marking.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.critter.findMany).toHaveBeenCalledTimes(2);
        expect(returnedCritters).toBeInstanceOf(Array);
        expect(returnedCritters[0].critter_id).toBe(CRITTER_ID);
      });
      it("should return critters by their markings", async () => {
        expect.assertions(3);
        markingFindMany.mockResolvedValue([MARKING]);
        const returnedCritters1 = await _getSimilarCritters({
          markings: [
            {
              marking_type: "Ear Tag",
              primary_colour: "Red",
              secondary_colour: "Red",
              body_location: "Left Ear",
              identifier: "11",
            },
          ],
        });
        expect(returnedCritters1[0].critter_id).toBe(CRITTER_ID);
        findMany.mockResolvedValueOnce([]);
        markingFindMany.mockResolvedValue([]);
        const returnedCritters2 = await _getSimilarCritters({ markings: [{}] });
        expect(returnedCritters2.length).toBe(0);
        expect(prisma.marking.findMany).toHaveBeenCalledTimes(2);
      });
      it("should return critters by capture data", async () => {
        captureFindMany.mockResolvedValue([CAPTURE]);
        const returnedCritters1 = await _getSimilarCritters({
          captures: [
            { capture_timestamp: new Date(), release_timestamp: new Date() },
          ],
        });
        findMany.mockResolvedValueOnce([]);
        const returnedCritters2 = await _getSimilarCritters({ captures: [{}] });
        expect.assertions(3);
        expect(prisma.capture.findMany).toHaveBeenCalledTimes(2);
        expect(returnedCritters1[0].critter_id).toBe(CRITTER_ID);
        expect(returnedCritters2.length).toBe(0);
      });
      it("should return critters by mortality", async () => {
        mortalityFindMany.mockResolvedValue([MORTALITY]);
        const returnedCritters1 = await _getSimilarCritters({
          mortality: { mortality_timestamp: new Date() },
        });
        findMany.mockResolvedValueOnce([]);
        const returnedCritters2 = await _getSimilarCritters({ mortality: {} });
        expect.assertions(3);
        expect(prisma.mortality.findMany).toHaveBeenCalledTimes(2);
        expect(returnedCritters2.length).toBe(0);
        expect(returnedCritters1[0].critter_id).toBe(CRITTER_ID);
      });
    });
    describe("formatLocationNameSearch()", () => {
      it("should return an object with entries for each of the location unit types", async () => {
        const obj = {
          region_env_name: "Somewhere",
          region_nr_name: "Name",
          wmu_name: "wmu",
        };
        const res = _formatLocationNameSearch(obj);
        expect.assertions(3);
        expect(res?.lk_region_env).not.toBeNull();
        expect(res?.lk_region_nr).not.toBeNull();
        expect(res?.lk_wildlife_management_unit).not.toBeNull();
      });
    });

    describe("appendEnglishTaxonAsUUID()", () => {
      it("should add taxon information to an object when common name is provided", async () => {
        taxonFindFirst.mockResolvedValue(TAXON);
        const res = await _appendEnglishTaxonAsUUID({
          taxon_name_common: "Caribou",
        });
        expect.assertions(3);
        expect(taxonFindFirst).toHaveBeenCalledTimes(1);
        expect(res).toHaveProperty("taxon_id");
        expect(res.taxon_id).toBe(TAXON.taxon_id);
      });

      it("should add taxon information to an object when latin name is provided", async () => {
        taxonFindFirst.mockResolvedValue(TAXON);
        const res = await _appendEnglishTaxonAsUUID({
          taxon_name_latin: "Rangifer tarandus",
        });
        expect.assertions(3);
        expect(taxonFindFirst).toHaveBeenCalledTimes(1);
        expect(res).toHaveProperty("taxon_id");
        expect(res.taxon_id).toBe(TAXON.taxon_id);
      });
    });
  });
  describe("ROUTERS", () => {
    describe("GET /api/critters", () => {
      it("should return status 200", async () => {
        expect.assertions(3);
        const res = await request.get("/api/critters");
        expect(res.status).toBe(200);
        expect(getAllCritters.mock.calls.length).toBe(1);
        expect(getAllCritters.mock.results[0].value[0].critter_id).toBe(
          CRITTER_ID
        );
      });
    });
    describe("POST /api/critters/filter", () => {
      it("should return status 200", async () => {
        taxonFindMany.mockResolvedValue([TAXON]);
        const body = {
          critter_ids: { body: [CRITTER_ID], negate: false },
          animal_ids: { body: ["bob"], negate: false },
          wlh_ids: { body: [WLH_ID], negate: false },
          taxon_name_commons: { body: ["Caribou"], negate: false },
          collection_units: {
            body: ["1af85263-6a7e-4b76-8ca6-118fd3c43f50"],
            negate: false,
          },
        };
        const res = await request.post("/api/critters/filter").send(body);
        expect.assertions(4);
        expect(res.status).toBe(200);
        expect(res.body[0].critter_id).toBe(CRITTER_ID);
        getAllCritters.mockResolvedValueOnce([]);
        const body2 = {
          critter_ids: { body: [CRITTER_ID], negate: true },
          animal_ids: { body: ["bob"], negate: true },
          wlh_ids: { body: [WLH_ID], negate: true },
          taxon_name_commons: { body: ["Caribou"], negate: true },
          collection_units: {
            body: ["1af85263-6a7e-4b76-8ca6-118fd3c43f50"],
            negate: true,
          },
        };
        const res2 = await request.post("/api/critters/filter").send(body2);
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(0);
      });
      it("should return status 200, test taxon_ids only case", async () => {
        const body = {
          taxon_ids: {
            body: ["1af85263-6a7e-4b76-8ca6-118fd3c43f50"],
            negate: true,
          },
        };
        const res = await request.post("/api/critters/filter").send(body);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body[0].critter_id).toBe(CRITTER_ID);
      });
      it("should return status 200, test empty body case", async () => {
        taxonFindMany.mockResolvedValue([TAXON]);
        getAllCritters.mockResolvedValueOnce([]);
        const body = {};
        const res = await request.post("/api/critters/filter").send(body);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
      });
    });
    describe("POST /api/critters/unique", () => {
      it("should return status 200", async () => {
        const body = { critter: CRITTER };
        const res = await request.post("/api/critters/unique").send(body);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body[0].critter_id).toBe(CRITTER_ID);
      });
    });
    describe("POST /api/critters/", () => {
      it("should return status 200", async () => {
        const body = { critter_ids: [CRITTER_ID] };
        const res = await request.post("/api/critters/").send(body);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body[0].critter_id).toBe(CRITTER_ID);
      });
    });
    describe("POST /api/critters/create", () => {
      it("should return a critter with status code 201", async () => {
        const res = await request
          .post("/api/critters/create")
          .send({ ...CRITTER, taxon_name_common: "Caribou" });
        console.log(res.body);
        expect.assertions(3);
        expect(createCritter).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body.wlh_id).toBe(WLH_ID);
      });
      it("should return a critter with status code 201", async () => {
        const res = await request
          .post("/api/critters/create")
          .send({ ...CRITTER, taxon_name_latin: "Rangifer tarandus" });
        expect.assertions(2);
        expect(res.status).toBe(201);
        expect(res.body.wlh_id).toBe(WLH_ID);
      });
      it("should return 400 if trying to create with bad value type", async () => {
        const res = await request
          .post("/api/critters/create")
          .send({ taxon_id: "11084b96-5cbd-421e-8106-511ecfb51f7a", sex: 123 });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });
    describe("GET /api/critters?wlh_id={wlh_id}", () => {
      it("should return status 200 and a valid critter", async () => {
        const res = await request.get("/api/critters?wlh_id=" + WLH_ID);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
      it("should return status 404 if searching bad wlh id", async () => {
        getCritterByWlhId.mockImplementation(() => {
          return [];
        });
        const res = await request.get("/api/critters?wlh_id=WHAT");
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("GET /api/critters/:id", () => {
      it("should return status 200", async () => {
        const res = await request.get("/api/critters/" + CRITTER_ID);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it("should return status 404 when critter id is not found", async () => {
        getCritterById.mockImplementation(() => {
          throw apiError.notFound("critter_id");
        });
        const res = await request.get("/api/critters/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("PUT /api/critters/:id", () => {
      it("should return status 200, and update the critter", async () => {
        updateCritter.mockImplementation(() => {
          return { ...DEFAULTFORMAT_CRITTER, animal_id: "Banana" };
        });
        const res = await request
          .put("/api/critters/" + CRITTER_ID)
          .send({ animal_id: "Banana" });
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.animal_id).toBe("Banana");
      });
      it("should return status 400 if you try to modify with a bad value type", async () => {
        updateCritter.mockImplementation(() => {
          throw Error();
        });
        const res = await request
          .put("/api/critters/" + CRITTER_ID)
          .send({ sex: 1234 });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
      it("should return status 404 when critter id is not found", async () => {
        updateCritter.mockImplementation(() => {
          throw apiError.notFound("critter_id");
        });
        const res = await request
          .put("/api/critters/" + randomUUID())
          .send({ animal_id: "Banana" });
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("DELETE /api/critters/:id", () => {
      it("should return status 200 and delete the critter", async () => {
        const res = await request.delete("/api/critters/" + CRITTER_ID);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.wlh_id).toBe(WLH_ID);
      });
      it("should return status 404 when critter id is not found", async () => {
        deleteCritter.mockImplementation(() => {
          throw apiError.notFound("not found");
        });
        const res = await request.delete("/api/critters/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
  });
});
