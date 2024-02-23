import { CritterRepository } from "./critter-repository";

import {
  CritterUpdate,
  ICritter,
  CritterCreateRequiredItis,
  SimilarCritterQuery,
  IDetailedCritterMarking,
  DetailedCritterMarkingSchema,
  CritterSchema,
  DetailedCritterMortalitySchema,
  IDetailedCritterMortality,
  DetailedCritterQualitativeMeasurementSchema,
  IDetailedCritterQualitativeMeasurement,
  DetailedCritterQuantitativeMeasurementSchema,
  IDetailedCritterQuantitativeMeasurement,
  DetailedCritterCollectionUnit,
  IDetailedCritterCollectionUnit,
  DetailedCritterCaptureSchema,
  IDetailedCritterCapture,
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
          critter_id: 'aaaa',
          itis_tsn: 1234,
          itis_scientific_name: 'Aaa',
          animal_id: 'aaaa',
          sex: 'Male',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        },
        {
          critter_id: 'bbbb',
          itis_tsn: 1234,
          itis_scientific_name: 'Bbb',
          animal_id: 'bbbb',
          sex: 'Female',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        },
      ];

      mockPrismaClient.critter.findMany.mockResolvedValue(
        mockResult
      );

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getAllCritters();

      expect(result).toEqual(mockResult);
      expect(
        mockPrismaClient.critter.findMany
      ).toHaveBeenCalledWith({
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
      });
    });

    it("should throw an error if no critters are found", async () => {
      mockPrismaClient.critter.findMany.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(
        critterRepository.getAllCritters()
      ).rejects.toThrow("Failed to find critters.");

      expect(
        mockPrismaClient.critter.findMany
      ).toHaveBeenCalledWith({
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
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
          critter_id: 'aaaa',
          itis_tsn: 1234,
          itis_scientific_name: 'Aaa',
          animal_id: 'aaaa',
          sex: 'Male',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        },
        {
          critter_id: 'bbbb',
          itis_tsn: 1234,
          itis_scientific_name: 'Bbb',
          animal_id: 'bbbb',
          sex: 'Female',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        },
      ];

      mockPrismaClient.critter.findMany.mockResolvedValue(
        mockResult
      );

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getMultipleCrittersByIds(['aaaa', 'bbbb']);

      expect(result).toEqual(mockResult);
      expect(
        mockPrismaClient.critter.findMany
      ).toHaveBeenCalledWith({
        where: { critter_id: { in: ['aaaa', 'bbbb'] } },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
      });
    });

    it("should throw an error if no critters are found", async () => {
      mockPrismaClient.critter.findMany.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(
        critterRepository.getMultipleCrittersByIds(['cccc', 'dddd'])
      ).rejects.toThrow("Failed to find critters.");

      expect(
        mockPrismaClient.critter.findMany
      ).toHaveBeenCalledWith({
        where: { critter_id: { in: ['cccc', 'dddd'] } },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
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
        critter_id: 'aaaa',
        itis_tsn: 1234,
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      mockPrismaClient.critter.findUnique.mockResolvedValue(
        mockResult
      );

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getCritterById('aaaa');

      expect(result).toEqual(mockResult);
      expect(
        mockPrismaClient.critter.findUnique
      ).toHaveBeenCalledWith({
        where: { critter_id: 'aaaa' },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
      });
    });

    it("should throw an error if no critter is found", async () => {
      mockPrismaClient.critter.findUnique.mockResolvedValue(null);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(
        critterRepository.getCritterById('cccc')
      ).rejects.toThrow("Failed to find specific critter.");

      expect(
        mockPrismaClient.critter.findUnique
      ).toHaveBeenCalledWith({
        where: { critter_id: 'cccc' },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
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
          critter_id: 'aaaa',
          itis_tsn: 1234,
          itis_scientific_name: 'Aaa',
          animal_id: 'aaaa',
          sex: 'Male',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        }
      ];

      mockPrismaClient.critter.findMany.mockResolvedValue(
        mockResult
      );

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getCrittersByWlhId('aaaa');

      expect(result).toEqual(mockResult);
      expect(
        mockPrismaClient.critter.findMany
      ).toHaveBeenCalledWith({
        where: { wlh_id: 'aaaa' },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
      });
    });

    it("should throw an error if no critter is found", async () => {
      mockPrismaClient.critter.findMany.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(
        critterRepository.getCrittersByWlhId('cccc')
      ).rejects.toThrow("Failed to find critters with wlh-id: cccc.");

      expect(
        mockPrismaClient.critter.findMany
      ).toHaveBeenCalledWith({
        where: { wlh_id: 'cccc' },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true,
        }
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
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      const mockResult: ICritter = {
        critter_id: 'aaaa',
        itis_tsn: 1234,
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      mockPrismaClient.critter.update.mockResolvedValue(
        mockResult
      );

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.updateCritter('aaaa', mockUpdate);

      expect(result).toEqual(mockResult);
      expect(
        mockPrismaClient.critter.update
      ).toHaveBeenCalledWith({
        where: { critter_id: 'aaaa' },
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
        }
      });
    });

    it("should catch and re-throw an error", async () => {
      mockPrismaClient.critter.update.mockRejectedValueOnce(new Error("Mock error"))
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(
        critterRepository.updateCritter('aaaa', {})
      ).rejects.toThrow("Failed to update critter.");

      expect(
        mockPrismaClient.critter.update
      ).toHaveBeenCalledWith({
        where: { critter_id: 'aaaa' },
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
        }
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
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      const mockResult: ICritter = {
        critter_id: 'aaaa',
        itis_tsn: 1234,
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      mockPrismaClient.critter.create.mockResolvedValue(
        mockResult
      );

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.createCritter(mockCreate);

      expect(result).toEqual(mockResult);
      expect(
        mockPrismaClient.critter.create
      ).toHaveBeenCalledWith({
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
        }
      });
    });

    it("should catch and re-throw an error", async () => {
      mockPrismaClient.critter.create.mockRejectedValueOnce(new Error("Mock error"))
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(
        critterRepository.createCritter({} as CritterCreateRequiredItis)
      ).rejects.toThrow("Failed to create critter.");

      expect(
        mockPrismaClient.critter.create
      ).toHaveBeenCalledWith({
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
        }
      });
    });
  });
});