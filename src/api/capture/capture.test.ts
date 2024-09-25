import { capture } from '@prisma/client';
import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { routes } from '../../utils/constants';
import { getDBMock, mockClient, mockContext } from '../../utils/mocks';

const CRITTER_ID = '11084b96-5cbd-421e-8106-511ecfb51f7a';
const CAPTURE_ID = '1af85263-6a7e-4b76-8ca6-118fd3c43f50';

const CAPTURE: capture = {
  capture_id: CAPTURE_ID,
  critter_id: CRITTER_ID,
  capture_location_id: null,
  release_location_id: null,
  capture_method_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  capture_date: new Date().toISOString() as unknown as Date,
  capture_time: new Date().toISOString() as unknown as Date,
  release_date: null,
  release_time: null,
  capture_comment: null,
  release_comment: null,
  create_user: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  update_user: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  create_timestamp: new Date().toISOString() as unknown as Date,
  update_timestamp: new Date().toISOString() as unknown as Date
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

describe('Capture Router', () => {
  describe(`POST ${routes.captures}/create`, () => {
    it('should return status 201', async () => {
      const createCaptureMock = jest.fn().mockResolvedValue(CAPTURE);

      const dbMock = getDBMock({ CaptureService: { createCapture: createCaptureMock } });
      const request = supertest(makeApp(dbMock as any));

      const res = await request.post('/api/captures/create').send(CAPTURE_PAYLOAD);

      expect(dbMock.getContext).toHaveBeenCalled();
      expect(dbMock.getDBClient).toHaveBeenCalled();
      expect(dbMock.transaction.mock.calls[0][0]).toBe(mockContext);
      expect(dbMock.transaction.mock.calls[0][1]).toBe(mockClient);
      expect(dbMock.services.CaptureService.init).toHaveBeenCalledWith(mockClient);
      expect(createCaptureMock).toHaveBeenCalledWith(CAPTURE_PAYLOAD);

      expect(res.status).toBe(201);
      expect(res.body).toStrictEqual(CAPTURE);
    });

    it('should return status 201 with included location data', async () => {
      const createCaptureMock = jest.fn().mockResolvedValue(CAPTURE);

      const dbMock = getDBMock({ CaptureService: { createCapture: createCaptureMock } });
      const request = supertest(makeApp(dbMock as any));

      const res = await request.post('/api/captures/create').send(CAPTURE_WITH_LOCATION);

      expect(createCaptureMock).toHaveBeenCalledWith(CAPTURE_WITH_LOCATION);
      expect(res.status).toBe(201);
      expect(res.body).toStrictEqual(CAPTURE);
    });
  });

  describe(`GET ${routes.captures}/:capture_id`, () => {
    it('should get one capture', async () => {
      const res = await request.get('/api/captures/' + CAPTURE_ID);
    });

    it('should 404', async () => {
      const res = await request.get('/api/captures/' + randomUUID());
    });
  });

  describe(`GET ${routes.captures}/critter/:critter_id`, () => {
    it('should return status 200 with an array of captures', async () => {
      const res = await request.get('/api/captures/critter/' + CRITTER_ID);
    });

    it('should 404 when trying to get a bad critter', async () => {
      const res = await request.get('/api/captures/critter/' + randomUUID());
    });
  });

  describe(`PATCH ${routes.captures}/:capture_id`, () => {
    it('should return status 200', async () => {
      const res = await request.patch('/api/captures/' + CAPTURE_ID).send({ capture_comment: 'eee' });
    });

    it('should 404 if the capture is not found', async () => {
      const res = await request.patch('/api/captures/' + randomUUID());
    });
  });

  describe(`DELETE ${routes.captures}/:capture_id`, () => {
    it('should return status 200', async () => {
      const res = await request.delete('/api/captures/' + randomUUID());
    });

    it('should 404 if there is no capture to delete', async () => {
      const res = await request.delete('/api/captures/' + randomUUID());
    });
  });
});
