import { CritterRepository } from "./critter-repository";

import {
  CritterUpdate,
  ICritter,
  CritterCreateRequiredItis,
  SimilarCritterQuery,
  IDetailedCritterMarking,
  IDetailedCritterMortality,
  IDetailedCritterQualitativeMeasurement,
  IDetailedCritterCollectionUnit,
  IDetailedCritterCapture,
  IDetailedCritterParent,
  IDetailedCritterChild,
} from "../schemas/critter-schema";

describe("xref-repository", () => {
  let mockPrismaClient;

  describe("getAllCritters", () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          findMany: jest.fn(),
        },
      };
    });

    it("should return some critters successfully", async () => {
      const mockResult: ICritter[] = [
        {
          critter_id: "aaaa",
          itis_tsn: 1234,
          itis_scientific_name: "Aaa",
          animal_id: "aaaa",
          sex: "Male",
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null,
        },
        {
          critter_id: "bbbb",
          itis_tsn: 1234,
          itis_scientific_name: "Bbb",
          animal_id: "bbbb",
          sex: "Female",
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null,
        },
      ];

      mockPrismaClient.critter.findMany.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getAllCritters();

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: "desc",
        },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });

    it("should throw an error if no critters are found", async () => {
      mockPrismaClient.critter.findMany.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(critterRepository.getAllCritters()).rejects.toThrow(
        "Failed to find critters."
      );

      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: "desc",
        },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });
  });

  describe("getMultipleCrittersByIds", () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          findMany: jest.fn(),
        },
      };
    });

    it("should return some critters successfully", async () => {
      const mockResult: ICritter[] = [
        {
          critter_id: "aaaa",
          itis_tsn: 1234,
          itis_scientific_name: "Aaa",
          animal_id: "aaaa",
          sex: "Male",
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null,
        },
        {
          critter_id: "bbbb",
          itis_tsn: 1234,
          itis_scientific_name: "Bbb",
          animal_id: "bbbb",
          sex: "Female",
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null,
        },
      ];

      mockPrismaClient.critter.findMany.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getMultipleCrittersByIds([
        "aaaa",
        "bbbb",
      ]);

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: "desc",
        },
        where: { critter_id: { in: ["aaaa", "bbbb"] } },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });

    it("should return empty array if no critters are found", async () => {
      mockPrismaClient.critter.findMany.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);
      const res = await critterRepository.getMultipleCrittersByIds([
        "cccc",
        "dddd",
      ]);
      expect(res).toStrictEqual([]);

      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: "desc",
        },
        where: { critter_id: { in: ["cccc", "dddd"] } },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });
  });

  describe("getCritterById", () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          findUnique: jest.fn(),
        },
      };
    });

    it("should return a critter successfully", async () => {
      const mockResult: ICritter = {
        critter_id: "aaaa",
        itis_tsn: 1234,
        itis_scientific_name: "Aaa",
        animal_id: "aaaa",
        sex: "Male",
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null,
      };

      mockPrismaClient.critter.findUnique.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getCritterById("aaaa");

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.findUnique).toHaveBeenCalledWith({
        where: { critter_id: "aaaa" },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });

    it("should throw an error if no critter is found", async () => {
      mockPrismaClient.critter.findUnique.mockResolvedValue(null);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(critterRepository.getCritterById("cccc")).rejects.toThrow(
        "Failed to find specific critter."
      );

      expect(mockPrismaClient.critter.findUnique).toHaveBeenCalledWith({
        where: { critter_id: "cccc" },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });
  });

  describe("getCrittersByWlhId", () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          findMany: jest.fn(),
        },
      };
    });

    it("should return a critter successfully", async () => {
      const mockResult: ICritter[] = [
        {
          critter_id: "aaaa",
          itis_tsn: 1234,
          itis_scientific_name: "Aaa",
          animal_id: "aaaa",
          sex: "Male",
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null,
        },
      ];

      mockPrismaClient.critter.findMany.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getCrittersByWlhId("aaaa");

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: "desc",
        },
        where: { wlh_id: "aaaa" },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });

    it("should return an empty array if no critter is found", async () => {
      mockPrismaClient.critter.findMany.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);
      const res = await critterRepository.getCrittersByWlhId("cccc");
      expect(res).toStrictEqual([]);

      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: "desc",
        },
        where: { wlh_id: "cccc" },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });
  });

  describe("updateCritter", () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          update: jest.fn(),
        },
      };
    });

    it("should insert a critter successfully", async () => {
      const mockUpdate: CritterUpdate = {
        itis_tsn: 1234,
        //itis_scientific_name: "test",
        animal_id: "aaaa",
        sex: "Male",
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null,
      };

      const mockResult: ICritter = {
        critter_id: "aaaa",
        itis_tsn: 1234,
        itis_scientific_name: "Aaa",
        animal_id: "aaaa",
        sex: "Male",
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null,
      };

      mockPrismaClient.critter.update.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.updateCritter("aaaa", mockUpdate);

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.update).toHaveBeenCalledWith({
        where: { critter_id: "aaaa" },
        data: mockUpdate,
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });

    it("should catch and re-throw an error", async () => {
      mockPrismaClient.critter.update.mockRejectedValueOnce(
        new Error("Mock error")
      );
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(critterRepository.updateCritter("aaaa", {})).rejects.toThrow(
        "Failed to update critter."
      );

      expect(mockPrismaClient.critter.update).toHaveBeenCalledWith({
        where: { critter_id: "aaaa" },
        data: {},
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });
  });

  describe("createCritter", () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          create: jest.fn(),
        },
      };
    });

    it("should create a critter successfully", async () => {
      const mockCreate: CritterCreateRequiredItis = {
        itis_tsn: 1234,
        itis_scientific_name: "Aaa",
        animal_id: "aaaa",
        sex: "Male",
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null,
      };

      const mockResult: ICritter = {
        critter_id: "aaaa",
        itis_tsn: 1234,
        itis_scientific_name: "Aaa",
        animal_id: "aaaa",
        sex: "Male",
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null,
      };

      mockPrismaClient.critter.create.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.createCritter(mockCreate);

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.create).toHaveBeenCalledWith({
        data: mockCreate,
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });

    it("should catch and re-throw an error", async () => {
      mockPrismaClient.critter.create.mockRejectedValueOnce(
        new Error("Mock error")
      );
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(
        critterRepository.createCritter({} as CritterCreateRequiredItis)
      ).rejects.toThrow("Failed to create critter.");

      expect(mockPrismaClient.critter.create).toHaveBeenCalledWith({
        data: {},
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        },
      });
    });
  });

  describe("findSimilarCritters", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find similar critters successfully", async () => {
      const mockQuery: SimilarCritterQuery = {
        critter: {
          itis_tsn: 1234,
        },
      };

      const mockResult: ICritter[] = [
        {
          critter_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          itis_tsn: 1234,
          itis_scientific_name: "Aaa",
          animal_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          sex: "Male",
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null,
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findSimilarCritters(mockQuery);

      expect(result).toEqual(mockResult);
    });
  });

  describe("findCritterMarkings", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find critter markings successfully", async () => {
      const mockResult: IDetailedCritterMarking[] = [
        {
          marking_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          taxon_marking_body_location_id: "1",
          body_location: "body",
          marking_type: "type",
          marking_type_id: "1",
          material: "mmm",
          capture_id: null,
          mortality_id: null,
          primary_colour_id: "1",
          secondary_colour_id: "2",
          text_colour_id: "2",
          primary_colour: null,
          secondary_colour: null,
          text_colour: null,
          identifier: null,
          frequency: null,
          frequency_unit: null,
          order: null,
          attached_timestamp: new Date("1970-01-01"),
          removed_timestamp: null,
          comment: null,
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterMarkings("aaaa");

      expect(result).toEqual(mockResult);
    });
  });

  describe("findCritterCaptures", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find critter captures successfully", async () => {
      const mockResult: IDetailedCritterCapture[] = [
        {
          capture_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          capture_timestamp: new Date("1970-01-01"),
          release_timestamp: null,
          capture_location: {
            location_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
            latitude: null,
            longitude: null,
            coordinate_uncertainty: null,
            coordinate_uncertainty_unit: "m",
            wmu_id: "1",
            region_nr_id: "1",
            region_env_id: "1",
            elevation: null,
            temperature: null,
            location_comment: null,
          },
          release_location: {
            location_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
            latitude: null,
            longitude: null,
            wmu_id: "1",
            region_nr_id: "1",
            region_env_id: "1",
            coordinate_uncertainty: null,
            coordinate_uncertainty_unit: "m",
            elevation: null,
            temperature: null,
            location_comment: null,
          },
          capture_comment: "howdy",
          release_comment: "seeya",
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterCaptures("aaaa");

      expect(result).toEqual(mockResult);
    });
  });

  describe("findCritterMortalities", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find critter mortalities successfully", async () => {
      const mockResult: IDetailedCritterMortality[] = [
        {
          mortality_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          mortality_timestamp: new Date("1970-01-01"),
          location: {
            location_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
            latitude: null,
            longitude: null,
            wmu_id: "1",
            region_nr_id: "1",
            region_env_id: "1",
            coordinate_uncertainty: null,
            coordinate_uncertainty_unit: "m",
            elevation: null,
            temperature: null,
            location_comment: null,
          },
          proximate_cause_of_death_category: null,
          proximate_cause_of_death_reason: null,
          proximate_cause_of_death_confidence: null,
          ultimate_cause_of_death_category: null,
          ultimate_cause_of_death_reason: null,
          mortality_comment: null,
          proximate_predated_by_itis_tsn: null,
          ultimate_predated_by_itis_tsn: null,
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterMortalities("aaaa");

      expect(result).toEqual(mockResult);
    });
  });

  describe("findCritterQualitativeMeasurements", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find critter qualitative measurements successfully", async () => {
      const mockResult: IDetailedCritterQualitativeMeasurement[] = [
        {
          measurement_qualitative_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          taxon_measurement_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          qualitative_option_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          capture_id: null,
          mortality_id: null,
          measurement_name: "name",
          value: "value",
          measurement_comment: "aaaa",
          measured_timestamp: new Date("1970-01-01"),
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result =
        await critterRepository.findCritterQualitativeMeasurements("aaaa");

      expect(result).toEqual(mockResult);
    });
  });

  describe("findCritterCollectionUnits", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find critter collection units successfully", async () => {
      const mockResult: IDetailedCritterCollectionUnit[] = [
        {
          critter_collection_unit_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          collection_category_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          collection_unit_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          unit_name: "name",
          category_name: "name",
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterCollectionUnits("aaaa");

      expect(result).toEqual(mockResult);
    });
  });

  describe("findCritterParents", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find critter parents successfully", async () => {
      const mockResult: IDetailedCritterParent[] = [
        {
          family_label: "blah",
          family_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          parent_critter_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterParents("aaaa");

      expect(result).toEqual(mockResult);
    });
  });

  describe("findCritterChildren", () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn(),
      };
    });

    it("should find critter children successfully", async () => {
      const mockResult: IDetailedCritterChild[] = [
        {
          family_label: "blah",
          family_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
          child_critter_id: "da290f16-53f9-4c26-939e-d7f56c4c4513",
        },
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterChildren("aaaa");

      expect(result).toEqual(mockResult);
    });
  });
});
