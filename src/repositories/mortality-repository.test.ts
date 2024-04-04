import { MortalityRepository } from './mortality-repository';

const mockMortalities = [{ mortality: 1 }, { mortality: 2 }];
const mockMortality = { mortality: 1 };

describe('mortality-repository', () => {
  let mockPrismaClient;

  describe('getAllMortalities', () => {
    beforeEach(() => {
      mockPrismaClient = {
        mortality: {
          findMany: jest.fn()
        }
      };
    });

    it('should return some mortalities successfully', async () => {
      mockPrismaClient.mortality.findMany.mockResolvedValue(mockMortalities);

      const mortalityRepository = new MortalityRepository(mockPrismaClient);
      const result = await mortalityRepository.getAllMortalities();

      expect(result).toEqual(mockMortalities);
      expect(mockPrismaClient.mortality.findMany).toHaveBeenCalledWith();
    });
  });

  describe('getMortalityById', () => {
    const mortalityRepository = new MortalityRepository(mockPrismaClient);
    const mockSafeQuery = jest.spyOn(mortalityRepository, 'safeQuery').mockImplementation(async () => [mockMortality]);

    it('should return mortality successfully', async () => {
      const result = await mortalityRepository.getMortalityById('mortality_id');

      expect(mockSafeQuery).toHaveBeenCalledTimes(1);
      expect(result).not.toBeInstanceOf(Array);
      expect(result).toEqual(mockMortality);
    });

    it('should format the sql correctly - and should not change', async () => {
      await mortalityRepository.getMortalityById('mortality_id');

      expect(mockSafeQuery.mock.calls[0][0].values).toStrictEqual(['mortality_id']);

      // stripping extra whitespace to only test against the actual sql
      expect(mockSafeQuery.mock.calls[0][0].sql.replace(/ /g, '')).toBe(
        `
        SELECT
          m.*,
          json_build_object(
            'latitude', l.latitude,
            'longitude', l.longitude,
            'coordinate_uncertainty', l.coordinate_uncertainty,
            'temperature', l.temperature,
            'location_comment', l.location_comment,
            'region_env_id', l.region_env_id,
            'region_nr_id', l.region_nr_id,
            'wmu_id', l.wmu_id,
            'region_env_name', re.region_env_name,
            'region_nr_name', rn.region_nr_name,
            'wmu_name', rw.wmu_name
          ) as location,
        json_build_object(
          'cod_category', c1.cod_category,
          'cod_reason', c1.cod_reason
        ) as proximate_cause_of_death,
        json_build_object(
          'cod_category', c2.cod_category,
          'cod_reason', c2.cod_reason
        ) as ultimate_cause_of_death
        FROM mortality m
        JOIN lk_cause_of_death d1 ON m.proximate_cause_of_death_id = d1.cod_id
        JOIN lk_cause_of_death d2 ON m.ultimate_cause_of_death_id = d2.cod_id
        JOIN location l ON m.location_id = l.location_id
        JOIN lk_region_env re ON re.region_env_id = l.region_env_id
        JOIN lk_region_nr rn ON rn.region_nr_id = l.region_nr_id
        JOIN lk_wildlife_management_unit rw ON rw.wmu_id = l.wmu_id
        JOIN lk_cause_of_death c1 ON c1.cod_id = m.proximate_cause_of_death_id
        JOIN lk_cause_of_death c2 ON c2.cod_id = m.ultimate_cause_of_death_id
        WHERE mortality_id = ?::uuid;`.replace(/ /g, '')
      );
    });

    it.todo('should pass the correct zod schema to safeQuery');
  });

  describe('createMortality', () => {
    beforeEach(() => {
      mockPrismaClient = {
        mortality: {
          create: jest.fn()
        }
      };
    });

    it('should return created mortality', async () => {
      mockPrismaClient.mortality.create.mockResolvedValue(mockMortality);

      const mortalityRepository = new MortalityRepository(mockPrismaClient);
      const result = await mortalityRepository.createMortality(true as any);

      expect(result).toEqual(mockMortality);
      expect(mockPrismaClient.mortality.create).toHaveBeenCalled();
    });

    it.todo('should format the prisma create query correctly');
  });

  describe('updateMortality', () => {
    beforeEach(() => {
      mockPrismaClient = {
        mortality: {
          update: jest.fn()
        }
      };
    });

    it('should return updated mortality', async () => {
      mockPrismaClient.mortality.update.mockResolvedValue(mockMortality);

      const mortalityRepository = new MortalityRepository(mockPrismaClient);
      const result = await mortalityRepository.updateMortality('mortality_id', true as any);

      expect(result).toEqual(mockMortality);
      expect(mockPrismaClient.mortality.update).toHaveBeenCalled();
    });

    it.todo('should format the prisma update query correctly');
  });

  describe('deleteMortality', () => {
    beforeEach(() => {
      mockPrismaClient = {
        mortality: {
          delete: jest.fn(),
          findUniqueOrThrow: jest.fn()
        },
        location: {
          delete: jest.fn()
        }
      };
    });

    it('should return updated mortality', async () => {
      mockPrismaClient.mortality.delete.mockResolvedValue(mockMortality);
      mockPrismaClient.mortality.findUniqueOrThrow.mockResolvedValue({ location_id: 'a' });
      mockPrismaClient.location.delete.mockResolvedValue(true);

      const mortalityRepository = new MortalityRepository(mockPrismaClient);
      const result = await mortalityRepository.deleteMortality('mortality_id');

      expect(result).toEqual(mockMortality);
      expect(mockPrismaClient.mortality.delete).toHaveBeenCalled();
    });

    it.todo('should format the prisma delete query correctly');
  });
});
