import supertest from 'supertest';
import { makeApp } from '../../app';
import { prisma } from '../../utils/constants';
import { ICbDatabase } from '../../utils/database';
import { getTableDataTypes as _getTableDataTypes } from './access.service';

const queryRaw = jest.spyOn(prisma, '$queryRaw').mockImplementation();
const getTableDataTypes = jest.fn();

const request = supertest(
  makeApp({
    getTableDataTypes
  } as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  getTableDataTypes.mockReset();
  getTableDataTypes.mockResolvedValue(true);
  queryRaw.mockResolvedValue({ data: 'lol' });
});

describe('SERVICES', () => {
  describe('getTableDataTypes', () => {
    it('should call prisma raw query', () => {
      const types = _getTableDataTypes('user');
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(types).toBeDefined();
    });
  });

  describe('ROUTERS', () => {
    describe('/api/', () => {
      it('should return 200 and welcome message', async () => {
        const res = await request.get('/api/');
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
    });

    describe('/api/types/:model', () => {
      it('should return status 200 with valid body', async () => {
        const res = await request.get('/api/types/user');
        expect(getTableDataTypes.mock.calls.length).toBe(1);
        expect(getTableDataTypes.mock.calls[0][0]).toBe('user');
        expect(res.status).toBe(200);
      });
    });
  });
});
