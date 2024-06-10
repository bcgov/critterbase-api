import { capture } from '@prisma/client';
import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { routes } from '../../utils/constants';
import { ICbDatabase } from '../../utils/database';
import { apiError } from '../../utils/types';

const findCritterCaptures = jest.fn();
const getCaptureById = jest.fn();
const updateCapture = jest.fn();
const deleteCapture = jest.fn();
const deleteCaptures = jest.fn();
const createCapture = jest.fn();

const captureService = { getCaptureById, updateCapture, deleteCapture, deleteCaptures, createCapture };

const request = supertest(
  makeApp({
    captureService
  } as Record<keyof ICbDatabase, any>)
);

const CRITTER_ID = '11084b96-5cbd-421e-8106-511ecfb51f7a';
const CAPTURE_ID = '1af85263-6a7e-4b76-8ca6-118fd3c43f50';
const CAPTURE: capture = {
  capture_id: CAPTURE_ID,
  critter_id: CRITTER_ID,
  capture_location_id: null,
  release_location_id: null,
  capture_method_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  capture_date: new Date(),
  capture_time: new Date(),
  release_date: null,
  release_time: null,
  capture_comment: null,
  release_comment: null,
  create_user: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  update_user: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const CAPTURE_PAYLOAD = {
  capture_id: CAPTURE_ID,
  capture_date: new Date(),
  critter_id: CRITTER_ID
};

const LOCATION = {
  latitude: 2,
  longitude: 2
};

const CAPTURE_WITH_LOCATION = {
  ...CAPTURE_PAYLOAD,
  capture_location: LOCATION,
  release_location: LOCATION
};

beforeEach(() => {
  findCritterCaptures.mockResolvedValue(CAPTURE);
  getCaptureById.mockResolvedValue(CAPTURE);
  updateCapture.mockResolvedValue(CAPTURE);
  deleteCapture.mockResolvedValue(CAPTURE);
  createCapture.mockResolvedValue(CAPTURE);
});

describe('API: Critter', () => {
  describe('ROUTERS', () => {
    describe(`POST ${routes.captures}/create`, () => {
      it('should return status 201', async () => {
        const res = await request.post('/api/captures/create').send(CAPTURE_PAYLOAD);
        expect(res.body.capture_id).toBe(CAPTURE_ID);
        expect(createCapture.mock.calls.length).toBe(1);
        expect(createCapture).toHaveBeenCalledWith(CAPTURE_PAYLOAD);
        expect(res.status).toBe(201);
      });
      it('should return status 201 with included location data', async () => {
        const res = await request.post('/api/captures/create').send(CAPTURE_WITH_LOCATION);
        expect(res.body.capture_id).toBe(CAPTURE_ID);
        expect(createCapture.mock.calls.length).toBe(1);
        expect(createCapture).toHaveBeenCalledWith(CAPTURE_WITH_LOCATION);
        expect(res.status).toBe(201);
      });
    });

    describe(`GET ${routes.captures}/:capture_id`, () => {
      it('should get one capture', async () => {
        const res = await request.get('/api/captures/' + CAPTURE_ID);
        expect(getCaptureById.mock.calls.length).toBe(1);
        expect(getCaptureById).toHaveBeenCalledWith(CAPTURE_ID);
        expect(res.body.capture_id).toBe(CAPTURE_ID);
        expect(res.status).toBe(200);
      });
      it('should 404', async () => {
        getCaptureById.mockImplementation(() => {
          throw apiError.notFound('not found');
        });
        const res = await request.get('/api/captures/' + randomUUID());
        expect(res.status).toBe(404);
      });
    });

    describe(`GET ${routes.captures}/critter/:critter_id`, () => {
      it('should return status 200 with an array of captures', async () => {
        const res = await request.get('/api/captures/critter/' + CRITTER_ID);
        expect(findCritterCaptures.mock.calls.length).toBe(1);
        expect(findCritterCaptures).toHaveBeenCalledWith(CRITTER_ID);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.status).toBe(200);
      });
      it('should 404 when trying to get a bad critter', async () => {
        findCritterCaptures.mockImplementation(() => {
          throw apiError.notFound('not found');
        });
        const res = await request.get('/api/captures/critter/' + randomUUID());
        expect(res.status).toBe(404);
      });
    });

    describe(`PATCH ${routes.captures}/:capture_id`, () => {
      it('should return status 200', async () => {
        updateCapture.mockImplementation(() => {
          return { ...CAPTURE, capture_comment: 'eee' };
        });
        const res = await request.patch('/api/captures/' + CAPTURE_ID).send({ capture_comment: 'eee' });
        expect(updateCapture.mock.calls.length).toBe(1);
        expect(res.body.capture_comment).toBe('eee');
        expect(res.status).toBe(200);
      });
      it('should 404 if the capture is not found', async () => {
        expect.assertions(1);
        updateCapture.mockImplementation(() => {
          throw apiError.notFound('not found');
        });
        const res = await request.patch('/api/captures/' + randomUUID());
        expect(res.status).toBe(404);
      });
    });

    describe(`DELETE ${routes.captures}/:capture_id`, () => {
      it('should return status 200', async () => {
        const res = await request.delete('/api/captures/' + CAPTURE_ID);
        expect(res.status).toBe(200);
      });
      it('should 404 if there is no capture to delete', async () => {
        deleteCapture.mockImplementation(() => {
          throw apiError.notFound('not found');
        });
        const res = await request.delete('/api/captures/' + randomUUID());
        expect(res.status).toBe(404);
      });
    });
  });
});
