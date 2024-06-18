import { CaptureRepository } from './capture-repository';

const _captureProperties = {
  capture_id: true,
  critter_id: true,
  capture_method_id: true,
  capture_location_id: true,
  release_location_id: true,
  capture_date: true,
  capture_time: true,
  release_date: true,
  release_time: true,
  capture_comment: true,
  release_comment: true
};

const _captureLocationProperties = {
  location_id: true,
  latitude: true,
  longitude: true,
  coordinate_uncertainty: true,
  coordinate_uncertainty_unit: true,
  elevation: true,
  temperature: true,
  region_env_id: true,
  region_nr_id: true,
  wmu_id: true,
  location_comment: true
};

describe('capture-repository', () => {
  let mockPrismaClient;
  beforeEach(() => {
    mockPrismaClient = {
      capture: {
        findUniqueOrThrow: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn()
      }
    };
  });
  describe('getCaptureById', () => {
    it('should return data and format correct prisma query', async () => {
      mockPrismaClient.capture.findUniqueOrThrow.mockResolvedValue(true);

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.getCaptureById('A');

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        select: {
          ..._captureProperties,
          capture_location_id: false,
          release_location_id: false,
          capture_location: { select: _captureLocationProperties },
          release_location: { select: _captureLocationProperties }
        }
      });
    });
  });

  describe('findCritterCaptures', () => {
    it('should return data and format correct prisma query', async () => {
      mockPrismaClient.capture.findMany.mockResolvedValue(true);

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.findCritterCaptures('A');

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.findMany).toHaveBeenCalledWith({
        where: {
          critter_id: 'A'
        },
        select: {
          ..._captureProperties,
          capture_location_id: false,
          release_location_id: false,
          capture_location: { select: _captureLocationProperties },
          release_location: { select: _captureLocationProperties }
        }
      });
    });
  });

  describe('createCapture', () => {
    it('should return data and format correct prisma query', async () => {
      mockPrismaClient.capture.create.mockResolvedValue(true);

      const repo = new CaptureRepository(mockPrismaClient);
      const mockDate = new Date();
      const result = await repo.createCapture({ capture_date: mockDate, critter_id: 'A' });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.create).toHaveBeenCalledWith({
        data: {
          capture_date: mockDate,
          critter: { connect: { critter_id: 'A' } }
        },
        select: _captureProperties
      });
    });

    it('should include capture_method in prisma query if included in payload', async () => {
      mockPrismaClient.capture.create.mockResolvedValue(true);

      const mockDate = new Date();
      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.createCapture({ capture_date: mockDate, critter_id: 'A', capture_method_id: 'B' });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.create).toHaveBeenCalledWith({
        data: {
          capture_date: mockDate,
          critter: { connect: { critter_id: 'A' } },
          capture_method: { connect: { capture_method_id: 'B' } }
        },
        select: _captureProperties
      });
    });

    it('should include release/capture location in prisma query if included in payload', async () => {
      mockPrismaClient.capture.create.mockResolvedValue(true);

      const mockDate = new Date();
      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.createCapture({
        capture_date: mockDate,
        critter_id: 'A',
        release_location: { latitude: 1 },
        capture_location: { longitude: 1 }
      });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.create).toHaveBeenCalledWith({
        data: {
          capture_date: mockDate,
          critter: { connect: { critter_id: 'A' } },
          capture_location: { create: { longitude: 1 } },
          release_location: { create: { latitude: 1 } }
        },
        select: _captureProperties
      });
    });
  });

  describe('updateCapture', () => {
    it('should return data and format correct prisma query', async () => {
      mockPrismaClient.capture.update.mockResolvedValue(true);

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.updateCapture('A', { capture_comment: 'blah' });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.update).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        data: {
          capture_comment: 'blah'
        },
        select: {
          ..._captureProperties
        }
      });
    });

    it('should include critter if provided', async () => {
      mockPrismaClient.capture.update.mockResolvedValue(true);

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.updateCapture('A', { critter_id: 'B' });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.update).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        data: {
          critter: { connect: { critter_id: 'B' } }
        },
        select: _captureProperties
      });
    });

    it('should handle capture location upsert', async () => {
      mockPrismaClient.capture.update.mockResolvedValue(true);
      mockPrismaClient.capture.findUniqueOrThrow.mockResolvedValueOnce({ capture_location: { location_id: 'C' } });

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.updateCapture('A', { capture_location: { latitude: 1 } });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.update).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        data: {
          capture_location: {
            upsert: {
              create: { latitude: 1 },
              update: { latitude: 1, location_id: 'C' }
            }
          }
        },
        select: _captureProperties
      });
    });

    it('should handle release location create (when capture and release share location id)', async () => {
      mockPrismaClient.capture.update.mockResolvedValue(true);
      mockPrismaClient.capture.findUniqueOrThrow.mockResolvedValueOnce({
        capture_location: { location_id: 'C' },
        release_location: { location_id: 'C' }
      });

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.updateCapture('A', { release_location: { latitude: 1 } });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.update).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        data: {
          release_location: {
            create: { latitude: 1 }
          }
        },
        select: _captureProperties
      });
    });

    it('should handle release location update (when capture and release have different location ids)', async () => {
      mockPrismaClient.capture.update.mockResolvedValue(true);
      mockPrismaClient.capture.findUniqueOrThrow.mockResolvedValueOnce({
        capture_location: { location_id: 'C' },
        release_location: { location_id: 'D' }
      });

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.updateCapture('A', { release_location: { latitude: 1 } });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.update).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        data: {
          release_location: {
            update: { latitude: 1, location_id: 'D' }
          }
        },
        select: _captureProperties
      });
    });

    it('should handle capture_method', async () => {
      mockPrismaClient.capture.update.mockResolvedValue(true);
      mockPrismaClient.capture.findUniqueOrThrow.mockResolvedValueOnce({
        capture_location: { location_id: 'C' }
      });

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.updateCapture('A', { capture_method_id: 'D' });

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.update).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        data: {
          capture_method: { connect: { capture_method_id: 'D' } }
        },
        select: _captureProperties
      });
    });
  });

  describe('deleteCapture', () => {
    it('should return data and format correct prisma query', async () => {
      mockPrismaClient.capture.delete.mockResolvedValue(true);

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.deleteCapture('A');

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.delete).toHaveBeenCalledWith({
        where: {
          capture_id: 'A'
        },
        select: {
          ..._captureProperties
        }
      });
    });
  });

  describe('deleteMultipleCaptures', () => {
    it('should return data and format correct prisma query', async () => {
      mockPrismaClient.capture.deleteMany.mockResolvedValue(true);

      const repo = new CaptureRepository(mockPrismaClient);
      const result = await repo.deleteMultipleCaptures(['A']);

      expect(result).toEqual(true);
      expect(mockPrismaClient.capture.deleteMany).toHaveBeenCalledWith({
        where: {
          capture_id: { in: ['A'] }
        }
      });
    });
  });
});
