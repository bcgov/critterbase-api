import supertest from 'supertest';
import { makeApp } from '../../app';
import { sex } from '.prisma/client';
import { Prisma } from '@prisma/client';
import { cod_confidence, coordinate_uncertainty_unit as cuu, frequency_unit, measurement_unit } from '@prisma/client';
import { prisma } from '../../utils/constants';
import { getBodyLocationByName, getColourByName, getMarkingTypeByName } from './lookup.service';
import { codFormats } from './lookup.utils';
import { eCritterStatus } from '../../schemas/critter-schema';

const mockDB = {};
const request = supertest(makeApp(mockDB as any));
const mockVal: any = { value: true };
const prismaMock = (model: Prisma.ModelName, method: 'findMany' | 'findFirst' = 'findMany') =>
  jest.spyOn(prisma[model], method).mockImplementation().mockResolvedValue(mockVal);

describe('API: Lookup', () => {
  describe('UTILS', () => {
    describe('codFormats', () => {
      it('should correctly format cod_category with cod_reason', () => {
        const parser = codFormats!.asSelect!.schema;
        const parsed = parser.parse({
          cod_id: 'ID',
          cod_category: 'A',
          cod_reason: 'REASON'
        });
        expect(parsed.value).toEqual('A | REASON');
      });
    });
  });
  describe('SERVICES', () => {
    it(getColourByName.name, async () => {
      const mock = prismaMock('lk_colour', 'findFirst');
      const data: any = await getColourByName('name');
      expect(data.value).toBe(true);
      expect(mock.mock.calls.length).toBe(1);
    });
    it(getBodyLocationByName.name, async () => {
      const mock = prismaMock('xref_taxon_marking_body_location', 'findFirst');
      const data: any = await getBodyLocationByName('name');
      expect(data.value).toBe(true);
      expect(mock.mock.calls.length).toBe(1);
    });
    it(getMarkingTypeByName.name, async () => {
      const mock = prismaMock('lk_marking_type', 'findFirst');
      const data: any = await getMarkingTypeByName('name');
      expect(data.value).toBe(true);
      expect(mock.mock.calls.length).toBe(1);
    });
  });
  describe('ROUTERS', () => {
    describe('/lookups/enum', () => {
      const e = [
        { route: 'sex', enum: Object.keys(sex) },
        { route: 'critter-status', enum: Object.keys(eCritterStatus) },
        { route: 'cod-confidence', enum: Object.keys(cod_confidence) },
        { route: 'coordinate-uncertainty-unit', enum: Object.keys(cuu) },
        { route: 'frequency-units', enum: Object.keys(frequency_unit) },
        { route: 'measurement-units', enum: Object.keys(measurement_unit) }
        //{ route: "supported-systems", enum: Object.keys(system) },
      ];
      it('all enum routes should respond with enum values and status 200', async () => {
        for (const req of e) {
          const res = await request.get(`/api/lookups/enum/${req.route}`);
          expect(res.body).toStrictEqual(req.enum);
        }
      });
    });
    describe('/lookups', () => {
      const l = [
        { route: '/colours', mock: prismaMock('lk_colour') },
        { route: '/region-envs', mock: prismaMock('lk_region_env') },
        { route: '/region-nrs', mock: prismaMock('lk_region_nr') },
        {
          route: '/wmus',
          mock: jest.spyOn(prisma, '$queryRaw').mockImplementation().mockResolvedValue(mockVal)
        },
        { route: '/cods', mock: prismaMock('lk_cause_of_death') },
        {
          route: '/marking-materials',
          mock: prismaMock('lk_marking_material')
        },
        { route: '/marking-types', mock: prismaMock('lk_marking_type') },
        {
          route: '/collection-unit-categories',
          mock: prismaMock('lk_collection_category')
        }
      ];
      it('should return status 200 and a value for each lookup route optionally formatted asSelect', async () => {
        for (const req of l) {
          const res = await request.get(`/api/lookups${req.route}?format=asSelect`);
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('key');
          expect(req.mock.mock.calls.length).toBe(1);
          jest.clearAllMocks();
        }
      });
    });
  });
});
