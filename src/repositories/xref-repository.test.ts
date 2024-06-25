import { ICollectionCategoryDef, ITsnMarkingBodyLocation } from '../schemas/xref-schema';
import { XrefRepository } from './xref-repository';

describe('xref-repository', () => {
  let mockPrismaClient;

  describe('getCollectionUnitsFromCategoryId', () => {
    beforeEach(() => {
      mockPrismaClient = {
        xref_collection_unit: {
          findMany: jest.fn()
        }
      };
    });

    it('should return some collection units successfully', async () => {
      const mockResult = [
        {
          collection_unit_id: '1',
          collection_category_id: '1',
          unit_name: 'name',
          description: 'desc',
          create_user: '1',
          update_user: '1',
          create_timestamp: new Date('1970-01-01'),
          update_timestamp: new Date('1970-01-01')
        },
        {
          collection_unit_id: '2',
          collection_category_id: '2',
          unit_name: 'name',
          description: 'desc',
          create_user: '2',
          update_user: '2',
          create_timestamp: new Date('1970-01-01'),
          update_timestamp: new Date('1970-01-01')
        }
      ];

      mockPrismaClient.xref_collection_unit.findMany.mockResolvedValue(mockResult);

      const xrefRepository = new XrefRepository(mockPrismaClient);
      const result = await xrefRepository.getCollectionUnitsFromCategoryId('valid_category_id');

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.xref_collection_unit.findMany).toHaveBeenCalledWith({
        where: {
          collection_category_id: 'valid_category_id'
        }
      });
    });
  });

  describe('getCollectionUnitsFromCategoryOrTsns', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should return some collection units successfully', async () => {
      const mockResult = [
        {
          collection_unit_id: '1',
          collection_category_id: '1',
          unit_name: 'name',
          description: 'desc',
          create_user: '1',
          update_user: '1',
          create_timestamp: new Date('1970-01-01'),
          update_timestamp: new Date('1970-01-01')
        },
        {
          collection_unit_id: '2',
          collection_category_id: '2',
          unit_name: 'name',
          description: 'desc',
          create_user: '2',
          update_user: '2',
          create_timestamp: new Date('1970-01-01'),
          update_timestamp: new Date('1970-01-01')
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const xrefRepository = new XrefRepository(mockPrismaClient);
      const result = await xrefRepository.getCollectionUnitsFromCategoryOrTsns('valid_category_id', []);

      expect(result).toEqual(mockResult);
    });
  });

  describe('getTsnCollectionCategories', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should return a collection category for a TSN successfully', async () => {
      const mockResult: ICollectionCategoryDef[] = [
        {
          category_name: 'name',
          collection_category_id: '1',
          description: 'desc',
          itis_tsn: 123456
        },
        {
          category_name: 'name',
          collection_category_id: '2',
          description: 'desc',
          itis_tsn: 123456
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const xrefRepository = new XrefRepository(mockPrismaClient);
      const result = await xrefRepository.getTsnCollectionCategories([9]);

      expect(result).toEqual(mockResult);
    });
  });

  describe('getTsnMarkingBodyLocations', () => {
    beforeEach(() => {
      mockPrismaClient = {
        xref_taxon_marking_body_location: {
          findMany: jest.fn()
        }
      };
    });

    it('should return a set of "marking body locations" successfully', async () => {
      const mockResult: ITsnMarkingBodyLocation[] = [
        {
          description: 'desc',
          taxon_marking_body_location_id: '1',
          body_location: 'body location',
          itis_tsn: 123456
        },
        {
          description: 'desc',
          taxon_marking_body_location_id: '2',
          body_location: 'body location',
          itis_tsn: 456789
        }
      ];

      mockPrismaClient.xref_taxon_marking_body_location.findMany.mockResolvedValue(mockResult);

      const xrefRepository = new XrefRepository(mockPrismaClient);
      const result = await xrefRepository.getTsnMarkingBodyLocations([123456, 456789]);

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.xref_taxon_marking_body_location.findMany).toHaveBeenCalledWith({
        where: { itis_tsn: { in: [123456, 456789] } },
        select: {
          taxon_marking_body_location_id: true,
          itis_tsn: true,
          body_location: true,
          description: true
        }
      });
    });
  });

  describe('getTsnQualitativeMeasurements', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('should return a qualitative measurements array successfully', async () => {
      // Needs to be accurate, or Zod schema validator will raise an exception
      const mockResult = [
        {
          itis_tsn: 123456,
          options: [
            {
              taxon_measurement_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
              qualitative_option_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
              option_label: 'Label',
              option_value: 123,
              option_desc: 'desc'
            }
          ],
          taxon_measurement_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
          measurement_name: 'name',
          measurement_desc: 'desc'
        },
        {
          itis_tsn: 456789,
          options: [
            {
              taxon_measurement_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
              qualitative_option_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
              option_label: 'Label',
              option_value: 456,
              option_desc: 'desc'
            }
          ],
          taxon_measurement_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
          measurement_name: 'name',
          measurement_desc: 'desc'
        }
      ];

      mockPrismaClient.$queryRaw.mockResolvedValue(mockResult);

      const xrefRepository = new XrefRepository(mockPrismaClient);
      const result = await xrefRepository.getTsnQualitativeMeasurements([123456, 456789]);

      expect(result).toEqual(mockResult);
    });
  });

  describe('getQualitativeMeasurementOptions', () => {
    beforeEach(() => {
      mockPrismaClient = {
        xref_taxon_measurement_qualitative_option: {
          findMany: jest.fn()
        }
      };
    });

    it('should return some qualitative measurement options successfully', async () => {
      const mockResult = [
        {
          qualitative_option_id: '1',
          taxon_measurement_id: '1',
          option_value: 1,
          option_label: 'Label',
          option_desc: 'desc'
        },
        {
          qualitative_option_id: '2',
          taxon_measurement_id: '2',
          option_value: 2,
          option_label: 'Label',
          option_desc: 'desc'
        }
      ];

      mockPrismaClient.xref_taxon_measurement_qualitative_option.findMany.mockResolvedValue(mockResult);

      const xrefRepository = new XrefRepository(mockPrismaClient);
      const result = await xrefRepository.getQualitativeMeasurementOptions('aaaa');

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.xref_taxon_measurement_qualitative_option.findMany).toHaveBeenCalledWith({
        where: { taxon_measurement_id: 'aaaa' },
        select: {
          qualitative_option_id: true,
          taxon_measurement_id: true,
          option_value: true,
          option_label: true,
          option_desc: true
        }
      });
    });
  });

  describe('getTsnQuantitativeMeasurements', () => {
    beforeEach(() => {
      mockPrismaClient = {
        xref_taxon_measurement_quantitative: {
          findMany: jest.fn()
        }
      };
    });

    it('should return some collection units successfully', async () => {
      const mockResult = [
        {
          taxon_measurement_id: '1',
          itis_tsn: 123456,
          measurement_name: 'name',
          measurement_desc: 'desc',
          min_value: 1,
          max_value: 100,
          unit: null
        },
        {
          taxon_measurement_id: '2',
          itis_tsn: 456789,
          measurement_name: 'name',
          measurement_desc: 'desc',
          min_value: 1,
          max_value: 100,
          unit: null
        }
      ];

      mockPrismaClient.xref_taxon_measurement_quantitative.findMany.mockResolvedValue(mockResult);

      const xrefRepository = new XrefRepository(mockPrismaClient);
      const result = await xrefRepository.getTsnQuantitativeMeasurements([123456, 456789]);

      expect(result).toEqual(mockResult);
      expect(mockPrismaClient.xref_taxon_measurement_quantitative.findMany).toHaveBeenCalledWith({
        where: { itis_tsn: { in: [123456, 456789] } },
        select: {
          taxon_measurement_id: true,
          itis_tsn: true,
          measurement_desc: true,
          measurement_name: true,
          min_value: true,
          max_value: true,
          unit: true
        }
      });
    });
  });
});
