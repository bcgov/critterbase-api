import { CritterRepository } from './critter-repository';

import {
  CritterCreateRequiredItis,
  CritterUpdate,
  ICritter,
  IDetailedCritterChild,
  IDetailedCritterCollectionUnit,
  IDetailedCritterParent,
  IDetailedCritterQualitativeMeasurement,
  SimilarCritterQuery
} from '../schemas/critter-schema';

describe('xref-repository', () => {
  let mockPrismaClient;

  describe('getAllCritters', () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          findMany: jest.fn(),
          $queryRaw: jest.fn()
        }
      };
    });

    it('should return some critters successfully', async () => {
      const mockResult: ICritter[] = [
        {
          critter_id: 'aaaa',
          itis_tsn: 1234,
          itis_scientific_name: 'Aaa',
          animal_id: 'aaaa',
          sex_qualitative_option_id: 'Male',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        },
        {
          critter_id: 'bbbb',
          itis_tsn: 1234,
          itis_scientific_name: 'Bbb',
          animal_id: 'bbbb',
          sex_qualitative_option_id: 'Female',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        }
      ];

      mockPrismaClient.critter.findMany.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getAllCritters();

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: 'desc'
        },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex_qualitative_option_id: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true
        }
      });
    });

    it('should throw an error if no critters are found', async () => {
      mockPrismaClient.critter.findMany.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(critterRepository.getAllCritters()).rejects.toThrow('Failed to find critters.');

      expect(mockPrismaClient.critter.findMany).toHaveBeenCalledWith({
        orderBy: {
          create_timestamp: 'desc'
        },
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex_qualitative_option_id: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true
        }
      });
    });
  });

  describe('getMultipleCrittersByIds', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should return some critters successfully', async () => {
      const mockResult: ICritter[] = [
        {
          critter_id: 'aaaa',
          itis_tsn: 1234,
          itis_scientific_name: 'Aaa',
          animal_id: 'aaaa',
          sex_qualitative_option_id: 'Male',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        },
        {
          critter_id: 'bbbb',
          itis_tsn: 1234,
          itis_scientific_name: 'Bbb',
          animal_id: 'bbbb',
          sex_qualitative_option_id: 'Female',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getMultipleCrittersByIds(['aaaa', 'bbbb']);

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });

    it('should return empty array if no critters are found', async () => {
      mockPrismaClient.$queryRaw.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);
      const res = await critterRepository.getMultipleCrittersByIds(['cccc', 'dddd']);
      expect(res).toStrictEqual([]);

      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });
  });

  describe('getMultipleCrittersGeometryByIds', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should return capture and mortality geometries successfully', async () => {
      const mockCaptureResult = [
        {
          capture_id: 'capture1',
          coordinates: [12.35, -134.33]
        },
        {
          capture_id: 'capture2',
          coordinates: [14.39, -119.48]
        }
      ];

      const mockMortalityResult = [
        {
          mortality_id: 'mortality1',
          coordinates: [14.39, -119.48]
        }
      ];

      const mockResponse = { captures: mockCaptureResult, mortalities: mockMortalityResult };

      mockPrismaClient.$queryRaw.mockResolvedValue([mockResponse]);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getMultipleCrittersGeometryByIds(['critter1', 'critter2']);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCritterById', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should return a critter successfully', async () => {
      const mockResult: ICritter = {
        critter_id: 'aaaa',
        itis_tsn: 1234,
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex_qualitative_option_id: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      mockPrismaClient.$queryRaw.mockResolvedValue([mockResult]);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getCritterById('aaaa');

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });

    it('should throw an error if no critter is found', async () => {
      mockPrismaClient.$queryRaw.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(critterRepository.getCritterById('cccc')).rejects.toThrow('Failed to find specific critter.');

      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });
  });

  describe('getCrittersByWlhId', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should return a critter successfully', async () => {
      const mockResult: ICritter[] = [
        {
          critter_id: 'aaaa',
          itis_tsn: 1234,
          itis_scientific_name: 'Aaa',
          animal_id: 'aaaa',
          sex_qualitative_option_id: 'Male',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.getCrittersByWlhId('aaaa');

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });

    it('should return an empty array if no critter is found', async () => {
      mockPrismaClient.$queryRaw.mockResolvedValue([]);
      const critterRepository = new CritterRepository(mockPrismaClient);
      const res = await critterRepository.getCrittersByWlhId('cccc');
      expect(res).toStrictEqual([]);

      expect(mockPrismaClient.$queryRaw).toHaveBeenCalled();
    });
  });

  describe('updateCritter', () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          update: jest.fn()
        }
      };
    });

    it('should insert a critter successfully', async () => {
      const mockUpdate: CritterUpdate = {
        itis_tsn: 1234,
        animal_id: 'aaaa',
        sex_qualitative_option_id: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      const mockResult: ICritter = {
        critter_id: 'aaaa',
        itis_tsn: 1234,
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex_qualitative_option_id: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      mockPrismaClient.critter.update.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.updateCritter('aaaa', mockUpdate);

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.critter.update).toHaveBeenCalledWith({
        where: { critter_id: 'aaaa' },
        data: mockUpdate,
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex_qualitative_option_id: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true
        }
      });
    });

    it('should catch and re-throw an error', async () => {
      mockPrismaClient.critter.update.mockRejectedValueOnce(new Error('Mock error'));
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(critterRepository.updateCritter('aaaa', {})).rejects.toThrow('Failed to update critter.');

      expect(mockPrismaClient.critter.update).toHaveBeenCalledWith({
        where: { critter_id: 'aaaa' },
        data: {},
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex_qualitative_option_id: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true
        }
      });
    });
  });

  describe('createCritter', () => {
    beforeEach(() => {
      mockPrismaClient = {
        critter: {
          create: jest.fn()
        }
      };
    });

    it('should create a critter successfully', async () => {
      const mockCreate: CritterCreateRequiredItis = {
        itis_tsn: 1234,
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex_qualitative_option_id: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
      };

      const mockResult: ICritter = {
        critter_id: 'aaaa',
        itis_tsn: 1234,
        itis_scientific_name: 'Aaa',
        animal_id: 'aaaa',
        sex_qualitative_option_id: 'Male',
        wlh_id: null,
        responsible_region_nr_id: null,
        critter_comment: null
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
          sex_qualitative_option_id: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true
        }
      });
    });

    it('should catch and re-throw an error', async () => {
      mockPrismaClient.critter.create.mockRejectedValueOnce(new Error('Mock error'));
      const critterRepository = new CritterRepository(mockPrismaClient);

      await expect(critterRepository.createCritter({} as CritterCreateRequiredItis)).rejects.toThrow(
        'Failed to create critter.'
      );

      expect(mockPrismaClient.critter.create).toHaveBeenCalledWith({
        data: {},
        select: {
          critter_id: true,
          itis_tsn: true,
          itis_scientific_name: true,
          animal_id: true,
          sex_qualitative_option_id: true,
          wlh_id: true,
          responsible_region_nr_id: true,
          critter_comment: true
        }
      });
    });
  });

  describe('findSimilarCritters', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should find similar critters successfully', async () => {
      const mockQuery: SimilarCritterQuery = {
        critter: {
          itis_tsn: 1234
        }
      };

      const mockResult: ICritter[] = [
        {
          critter_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          itis_tsn: 1234,
          itis_scientific_name: 'Aaa',
          animal_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          sex_qualitative_option_id: 'Male',
          wlh_id: null,
          responsible_region_nr_id: null,
          critter_comment: null
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findSimilarCritters(mockQuery);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findCritterQualitativeMeasurements', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should find critter qualitative measurements successfully', async () => {
      const mockResult: IDetailedCritterQualitativeMeasurement[] = [
        {
          measurement_qualitative_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          taxon_measurement_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          qualitative_option_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          capture_id: null,
          mortality_id: null,
          measurement_name: 'name',
          value: 'value',
          measurement_comment: 'aaaa',
          measured_timestamp: new Date('1970-01-01')
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterQualitativeMeasurements('aaaa');

      expect(result).toEqual(mockResult);
    });
  });

  describe('findCritterCollectionUnits', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should find critter collection units successfully', async () => {
      const mockResult: IDetailedCritterCollectionUnit[] = [
        {
          critter_collection_unit_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          collection_category_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          collection_unit_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          unit_name: 'name',
          category_name: 'name'
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterCollectionUnits('aaaa');

      expect(result).toEqual(mockResult);
    });
  });

  describe('findCritterParents', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should find critter parents successfully', async () => {
      const mockResult: IDetailedCritterParent[] = [
        {
          family_label: 'blah',
          family_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          parent_critter_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513'
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterParents('aaaa');

      expect(result).toEqual(mockResult);
    });
  });

  describe('findCritterChildren', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should find critter children successfully', async () => {
      const mockResult: IDetailedCritterChild[] = [
        {
          family_label: 'blah',
          family_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513',
          child_critter_id: 'da290f16-53f9-4c26-939e-d7f56c4c4513'
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const critterRepository = new CritterRepository(mockPrismaClient);
      const result = await critterRepository.findCritterChildren('aaaa');

      expect(result).toEqual(mockResult);
    });
  });
});
