import { Prisma } from '@prisma/client';
import { Repository } from './base-repository';
import { z } from 'zod';
import { apiError } from '../utils/types';

jest.mock('../utils/constants', () => ({
  is_dev: false
}));

describe('base-repository', () => {
  let mockPrismaClient;

  beforeEach(() => {
    mockPrismaClient = {
      $queryRaw: jest.fn()
    };
  });
  describe('safeQuery', () => {
    it('returns right away !IS_DEV', async () => {
      jest.requireMock('../utils/constants').IS_DEV = false;
      const mockResponse = { id: 1 };
      const schema = z.object({ id: z.number() });
      schema.safeParse = jest.fn();
      mockPrismaClient.$queryRaw.mockResolvedValue(mockResponse);
      const repo = new Repository(mockPrismaClient);
      const response = await repo.safeQuery(Prisma.sql`select 1 as id;`, schema);

      expect(response).toEqual({ id: 1 });
      expect(schema.safeParse).not.toBeCalled();
    });
    it('throws if parse fails', async () => {
      jest.requireMock('../utils/constants').IS_DEV = true;
      const mockResponse = { id: 1 };
      const schema = z.object({ id: z.number() });
      schema.safeParse = jest.fn().mockReturnValue({ success: false, error: { errors: [] } });
      mockPrismaClient.$queryRaw.mockResolvedValue(mockResponse);
      const repo = new Repository(mockPrismaClient);

      try {
        await repo.safeQuery(Prisma.sql`select 1 as id;`, schema);
      } catch (error) {
        expect(schema.safeParse).toBeCalledWith(mockResponse);
        expect((error as apiError).message).toContain('Failed to parse raw sql with provided Zod schema');
      }
    });
    it('succeeds with valid data', async () => {
      jest.requireMock('../utils/constants').IS_DEV = false;
      const mockResponse = { id: 1 };
      const schema = z.object({ id: z.number() });
      schema.safeParse = jest.fn();
      mockPrismaClient.$queryRaw.mockResolvedValue(mockResponse);
      const repo = new Repository(mockPrismaClient);
      const response = await repo.safeQuery(Prisma.sql`select 1 as id;`, schema);

      expect(response).toEqual({ id: 1 });
    });
  });
});
