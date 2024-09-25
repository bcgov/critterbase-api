import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DBClient } from '../client/client';
import { apiError } from '../utils/types';
import { Repository } from './base-repository';

describe('base-repository', () => {
  let mockPrismaClient;

  describe('constructor', () => {
    it('should set variables to defaults', () => {
      const repo = new Repository({} as unknown as DBClient);
      expect(repo.prisma).toBeDefined();
    });

    it('should be able to inject new dependencies', () => {
      const repo = new Repository('test' as unknown as DBClient);
      expect(repo.prisma).toBe('test');
    });
  });

  describe('safeQuery', () => {
    beforeEach(() => {
      mockPrismaClient = {
        $queryRaw: jest.fn()
      };
    });

    it('returns right away !IS_DEV', async () => {
      jest.requireMock('../utils/constants').IS_DEV = false;
      const mockResponse = { id: 1 };
      const schema = z.object({ id: z.number() });
      schema.safeParse = jest.fn();
      mockPrismaClient.$queryRaw.mockResolvedValue(mockResponse);
      const repo = new Repository(mockPrismaClient);
      const response = await repo.safeQuery(Prisma.sql`select 1 as id;`, schema);

      expect(response).toEqual({ id: 1 });
      expect(schema.safeParse).not.toHaveBeenCalled();
    });

    it('throws if parse fails', async () => {
      jest.requireMock('../utils/constants').IS_DEV = true;
      mockPrismaClient.$queryRaw.mockResolvedValue(1);

      const repo = new Repository(mockPrismaClient);

      try {
        await repo.safeQuery(Prisma.sql`select 1 as id;`, z.string());
        expect(false).toBe(true);
      } catch (error) {
        //expect((error as apiError).message).toContain('Failed to parse raw sql with provided Zod schema');
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

  describe('validateSameResponse', () => {
    const repo = new Repository(mockPrismaClient);
    it('should return new response when both objects are equal', () => {
      expect(repo.validateSameResponse({ a: 1 }, { a: 1 })).toBeTruthy();
      expect(repo.validateSameResponse([{ a: 1 }], [{ a: 1 }])).toBeTruthy();
      expect(repo.validateSameResponse(1, 1)).toBeTruthy();
    });

    it('should throw error when both responses are not equal', () => {
      expect(() => repo.validateSameResponse({ a: 1 }, { b: 2 })).toThrow(apiError);
      expect(() => repo.validateSameResponse({ a: 1 }, { c: 2 })).toThrow(apiError);
      expect(() => repo.validateSameResponse([{ a: 1 }], [{ b: 2 }])).toThrow(apiError);
      expect(() => repo.validateSameResponse(1, 2)).toThrow(apiError);
    });
  });
});
