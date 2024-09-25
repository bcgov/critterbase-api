import { user } from '@prisma/client';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { CreateUser } from '../../schemas/user-schema';
import { getDBMock, mockClient, mockContext } from '../../utils/mocks';
import { apiError } from '../../utils/types';

// Mock User Objects
const ID = '11084b96-5cbd-421e-8106-511ecfb51f7a';

const NEW_USER: CreateUser = {
  user_identifier: 'MOCK_USER',
  keycloak_uuid: ID
};

const RETURN_USER: user = {
  ...NEW_USER,
  keycloak_uuid: ID,
  user_id: ID,
  create_user: ID,
  update_user: ID,
  create_timestamp: new Date().toISOString() as unknown as Date,
  update_timestamp: new Date().toISOString() as unknown as Date
};

describe('API: User', () => {
  describe('ROUTERS', () => {
    describe('POST /api/users/create', () => {
      it('returns status 201', async () => {
        const createUserMock = jest.fn().mockResolvedValue(RETURN_USER);

        const dbMock = getDBMock({ UserService: { createUser: createUserMock } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.post('/api/users/create').send(NEW_USER);

        expect(dbMock.getContext).toHaveBeenCalled();
        expect(dbMock.getClient).toHaveBeenCalled();
        expect(dbMock.transaction.mock.calls[0][0]).toBe(mockContext);
        expect(dbMock.transaction.mock.calls[0][1]).toBe(mockClient);
        expect(dbMock.services.UserService.init).toHaveBeenCalledWith(mockClient);
        expect(createUserMock).toHaveBeenCalledWith(NEW_USER);

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(RETURN_USER);
      });

      it('strips invalid fields from data', async () => {
        const createUserMock = jest.fn();

        const dbMock = getDBMock({ UserService: { createUser: createUserMock } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.post('/api/users/create').send({ ...NEW_USER, invalidField: 'qwerty123' });

        expect(createUserMock).toHaveBeenCalledWith(NEW_USER);
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty('invalidField');
      });

      it('returns status 400 when data is missing required fields', async () => {
        const createUserMock = jest.fn();

        const dbMock = getDBMock({ UserService: { createUser: createUserMock } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.post('/api/users/create').send({ keycloak_uuid: ID });

        expect(createUserMock).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
      });
    });

    describe('GET /api/users/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        const getUserMock = jest.fn().mockImplementation(() => {
          throw apiError.notFound('error');
        });

        const dbMock = getDBMock({ UserService: { getUserById: getUserMock } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.get(`/api/users/${ID}`);

        expect(getUserMock).toHaveBeenCalledWith(ID);
        expect(res.status).toBe(404);
      });

      it('returns status 200', async () => {
        const getUserMock = jest.fn().mockResolvedValue(RETURN_USER);

        const dbMock = getDBMock({ UserService: { getUserById: getUserMock } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.get(`/api/users/${ID}`);

        expect(getUserMock).toHaveBeenCalledWith(ID);
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(RETURN_USER);
      });
    });

    describe('PATCH /api/users/:id', () => {
      it('returns status 200', async () => {
        const updateUserMock = jest.fn().mockResolvedValue(RETURN_USER);

        const dbMock = getDBMock({ UserService: { updateUser: updateUserMock } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.patch(`/api/users/${ID}`).send({ keycloak_uuid: ID });

        expect(dbMock.getContext).toHaveBeenCalled();
        expect(dbMock.getClient).toHaveBeenCalled();
        expect(dbMock.transaction.mock.calls[0][0]).toBe(mockContext);
        expect(dbMock.transaction.mock.calls[0][1]).toBe(mockClient);
        expect(dbMock.services.UserService.init).toHaveBeenCalledWith(mockClient);
        expect(updateUserMock).toHaveBeenCalledWith(ID, { keycloak_uuid: ID });

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(RETURN_USER);
      });

      it('returns status 404 when id does not exist', async () => {
        const updateUser = jest.fn().mockImplementation(() => {
          throw apiError.notFound('error');
        });

        const dbMock = getDBMock({ UserService: { updateUser: updateUser } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.patch(`/api/users/${ID}`).send({});

        expect(updateUser).toHaveBeenCalledWith(ID, {});
        expect(res.status).toBe(404);
      });

      it('returns status 400 when paramaters are invalid', async () => {
        const updateUser = jest.fn();

        const dbMock = getDBMock({ UserService: { updateUser: updateUser } });
        const request = supertest(makeApp(dbMock as any));

        const res = await request.patch(`/api/users/1`).send({ bad: 'data' });

        expect(updateUser).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
      });
    });
  });
});
