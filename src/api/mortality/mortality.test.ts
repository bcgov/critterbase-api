import { critter, mortality } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { ICbDatabase } from '../../utils/database';
import { getDBMock, mockClient, mockContext } from '../../utils/mocks';
import { apiError } from '../../utils/types';

const createMortality = jest.fn();
const deleteMortality = jest.fn();
const getAllMortalities = jest.fn();
const getMortalityByCritter = jest.fn();
const getMortalityById = jest.fn();
const updateMortality = jest.fn();

const request = supertest(
  makeApp({
    mortalityService: {
      createMortality,
      deleteMortality,
      getAllMortalities,
      getMortalityById,
      updateMortality,
      getMortalityByCritter
    }
  } as Record<keyof ICbDatabase, any>)
);

const CRITTER_ID = '11084b96-5cbd-421e-8106-511ecfb51f7a';
const MORTALITY_ID = '1af85263-6a7e-4b76-8ca6-118fd3c43f50';
const MORTALITY: mortality = {
  mortality_id: MORTALITY_ID,
  critter_id: CRITTER_ID,
  location_id: null,
  mortality_timestamp: new Date().toISOString() as unknown as Date,
  proximate_cause_of_death_id: '11084b96-5cbd-421e-8106-511ecfb51f7a',
  proximate_cause_of_death_confidence: null,
  proximate_predated_by_itis_tsn: null,
  ultimate_cause_of_death_id: null,
  ultimate_cause_of_death_confidence: null,
  ultimate_predated_by_itis_tsn: null,
  mortality_comment: null,
  create_user: '11084b96-5cbd-421e-8106-511ecfb51f7a',
  update_user: '11084b96-5cbd-421e-8106-511ecfb51f7a',
  create_timestamp: new Date().toISOString() as unknown as Date,
  update_timestamp: new Date().toISOString() as unknown as Date
};

const LOCATION = {
  latitude: 2,
  longitude: 2,
  coordinate_uncertainty: 2,
  temperature: 2,
  location_comment: 'test',
  lk_region_env: null,
  lk_region_nr: null,
  lk_wildlife_management_unit: null
};

const CRITTER: critter = {
  critter_id: CRITTER_ID,
  itis_tsn: 1,
  itis_scientific_name: 'Alces',
  wlh_id: '12-1234',
  animal_id: 'A13',
  sex: 'Male',
  responsible_region_nr_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date(),
  critter_comment: 'Hi :)'
};

beforeEach(() => {
  createMortality.mockImplementation(() => {
    return MORTALITY;
  });
  updateMortality.mockImplementation(() => {
    return MORTALITY;
  });
  deleteMortality.mockImplementation(() => {
    return MORTALITY;
  });
  getAllMortalities.mockImplementation(() => {
    return [MORTALITY];
  });
  getMortalityById.mockImplementation(() => {
    return MORTALITY;
  });
  getMortalityByCritter.mockImplementation(() => {
    return [MORTALITY];
  });
});

describe('API: Critter', () => {
  describe('ROUTERS', () => {
    describe('GET /api/mortality', () => {
      it('should return status 200', async () => {
        expect.assertions(3);
        const res = await request.get('/api/mortality');
        expect(getAllMortalities.mock.calls.length).toBe(1);
        expect(getAllMortalities.mock.results[0].value[0].mortality_id).toBe(MORTALITY_ID);
        expect(res.status).toBe(200);
      });
    });
    describe('GET /api/mortality/critter/:critter_id', () => {
      it('should return status 200', async () => {
        getMortalityByCritter.mockResolvedValue([CRITTER]);
        const res = await request.get('/api/mortality/critter/' + CRITTER_ID);
        expect.assertions(3);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(getMortalityByCritter.mock.calls.length).toBe(1);
      });
      it('should return status 404', async () => {
        getMortalityByCritter.mockImplementation(() => {
          throw apiError.notFound('not found');
        });
        const res = await request.get('/api/mortality/critter/' + randomUUID());
        expect.assertions(2);
        expect(getMortalityByCritter.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });
    });
    describe('POST /api/mortality/create', () => {
      it('should return status 200', async () => {
        const res = await request.post('/api/mortality/create').send(MORTALITY);
        expect.assertions(2);
        expect(createMortality.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
      });
    });
    describe('GET /api/mortality/:mortality_id', () => {
      it('should return status 200', async () => {
        const res = await request.get('/api/mortality/' + MORTALITY_ID);
        expect.assertions(2);
        expect(getMortalityById.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });
      it('should return status 404', async () => {
        getMortalityById.mockImplementation(() => {
          throw apiError.notFound('not found');
        });
        const res = await request.get('/api/mortality/' + randomUUID());
        expect.assertions(2);
        expect(getMortalityById.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });
    });
    describe('PATCH /api/mortality/:mortality_id', () => {
      it('should return status 200', async () => {
        updateMortality.mockResolvedValue({
          ...MORTALITY,
          mortality_comment: 'banana'
        });
        const mort = await request.patch('/api/mortality/' + MORTALITY_ID).send({ mortality_comment: 'banana' });
        expect.assertions(2);
        expect(updateMortality.mock.calls.length).toBe(1);
        expect(mort.status).toBe(200);
      });
      it('should return status 400', async () => {
        updateMortality.mockImplementation(() => {
          throw Error();
        });
        const mort = await request
          .patch('/api/mortality/' + '6109c0a8-a71d-4662-9604-a8beb72f2f6f')
          .send({ mortality_comment: 123 });
        expect.assertions(1);
        expect(mort.status).toBe(400);
      });
    });
    describe('DELETE /api/mortality/:mortality_id', () => {
      it('should return status 200', async () => {
        const deleteMortalityMock = jest.fn().mockResolvedValue(MORTALITY);

        const dbMock = getDBMock({ MortalityService: { deleteMortality: deleteMortalityMock } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.delete('/api/mortality/' + MORTALITY_ID);

        expect(dbMock.getContext).toHaveBeenCalled();
        expect(dbMock.getDBClient).toHaveBeenCalled();
        expect(dbMock.transaction.mock.calls[0][0]).toBe(mockContext);
        expect(dbMock.transaction.mock.calls[0][1]).toBe(mockClient);
        expect(dbMock.services.MortalityService.init).toHaveBeenCalledWith(mockClient);

        expect(deleteMortalityMock).toHaveBeenCalledWith(MORTALITY_ID);
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(MORTALITY);
      });
    });
  });
});
