jest.mock('../repositories/xref-repository');

import { DBClient } from '../client/client';
import { XrefRepository } from '../repositories/xref-repository';
import { ItisService } from './itis-service';
import { XrefService } from './xref-service';

const mockRepository: jest.Mocked<XrefRepository> = {
  prisma: {} as unknown as DBClient,
  safeQuery: jest.fn(),
  validateSameResponse: jest.fn(),
  findCollectionUnitsFromTsns: jest.fn(),
  getCollectionUnitsFromCategoryId: jest.fn(),
  searchForQualitativeMeasurements: jest.fn(),
  searchForQuantitativeMeasurements: jest.fn(),
  getCollectionUnitsFromCategoryOrTsns: jest.fn(),
  getTsnCollectionCategories: jest.fn(),
  getTsnMarkingBodyLocations: jest.fn(),
  getTsnQualitativeMeasurements: jest.fn(),
  getTsnQuantitativeMeasurements: jest.fn(),
  getQualitativeMeasurementOptions: jest.fn(),
  getQualitativeMeasurementsByIds: jest.fn(),
  getQuantitativeMeasurementsByIds: jest.fn()
};

const mockItisService = {
  getTsnHierarchy: jest.fn(),
  getTsnsHierarchy: jest.fn()
};

const xrefService = new XrefService(mockRepository, mockItisService as unknown as ItisService);

describe('xref-service', () => {
  describe('getCollectionUnitsFromCategoryId', () => {
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
      }
    ];
    it('should return collection units', async () => {
      mockRepository.getCollectionUnitsFromCategoryId.mockResolvedValue(mockResult);
      const result = await xrefService.getCollectionUnitsFromCategoryId('valid_category_id');
      expect(mockRepository.getCollectionUnitsFromCategoryId).toHaveBeenCalledWith('valid_category_id');
      expect(result).toStrictEqual(mockResult);
    });

    it('should return collection units as select format', async () => {
      mockRepository.getCollectionUnitsFromCategoryId.mockResolvedValue(mockResult);
      const result = await xrefService.getCollectionUnitsFromCategoryId('valid_category_id', true);
      expect(mockRepository.getCollectionUnitsFromCategoryId).toHaveBeenCalledWith('valid_category_id');
      expect(result).toStrictEqual([{ id: '1', key: 'collection_unit_id', value: 'name' }]);
    });
  });

  describe('searchForMeasurements', () => {
    const mockQuantResult = [
      {
        taxon_measurement_id: '1',
        itis_tsn: 1,
        measurement_name: 'name',
        measurement_desc: 'desc',
        min_value: 1,
        max_value: 100,
        unit: null
      }
    ];
    const mockQualResult = [
      {
        itis_tsn: 1,
        options: [
          {
            qualitative_option_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
            option_label: 'Label',
            option_value: 123,
            option_desc: 'desc'
          }
        ],
        taxon_measurement_id: 'c4ed6208-6fe4-41d1-94d3-17e49eb5f898',
        measurement_name: 'name',
        measurement_desc: 'desc'
      }
    ];
    const mockTsns = [1, 2];
    const mockHierarchyResult = [
      {
        tsn: mockTsns[0],
        hierarchy: [1, 2]
      },
      {
        tsn: mockTsns[1],
        hierarchy: [2, 3]
      }
    ];

    mockRepository.searchForQuantitativeMeasurements.mockResolvedValue(mockQuantResult);
    mockRepository.searchForQualitativeMeasurements.mockResolvedValue(mockQualResult);
    mockItisService.getTsnsHierarchy.mockReturnValue(mockHierarchyResult);

    it('should pass search to repository methods', async () => {
      await xrefService.searchForMeasurements({ name: 'age', tsns: mockTsns });

      expect(mockRepository.searchForQuantitativeMeasurements).toHaveBeenCalledWith({
        name: 'age',
        tsns: [1, 2, 3]
      });

      expect(mockRepository.searchForQualitativeMeasurements).toHaveBeenCalledWith({
        name: 'age',
        tsns: [1, 2, 3]
      });
    });

    it("should pass returned itis_tsn's to itisService method", async () => {
      await xrefService.searchForMeasurements({ name: 'age', tsns: mockTsns });

      expect(mockItisService.getTsnsHierarchy).toHaveBeenCalledWith(mockTsns);
    });

    it('should return measurements', async () => {
      const result = await xrefService.searchForMeasurements({ name: 'age', tsns: mockTsns });

      expect(result).toStrictEqual({
        quantitative: mockQuantResult,
        qualitative: mockQualResult
      });
    });
  });

  describe('findCollectionUnitsFromTsns', () => {
    it('should get tsns from itis and pass values to repository', async () => {
      const getTsnCollectionsMock = mockRepository.getTsnCollectionCategories.mockResolvedValue([]);
      const tsnHierarchyMock = mockItisService.getTsnHierarchy.mockResolvedValue([1, 2]);

      const data = await xrefService.getTsnCollectionCategories(1);

      expect(getTsnCollectionsMock).toHaveBeenCalledWith([1, 2]);
      expect(tsnHierarchyMock).toHaveBeenCalledWith(1);
      expect(data).toStrictEqual([]);
    });
  });
});
