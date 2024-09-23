import { user } from '@prisma/client';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { CreateUser, UserSchema } from '../../schemas/user-schema';
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
  create_timestamp: new Date(),
  update_timestamp: new Date()
};

const userService = {
  createUser: jest.fn(),
  upsertUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  setUserContext: jest.fn()
};

const request = supertest(makeApp({ userService } as any));

beforeEach(() => {
  // Set default returns
  userService.getUserById.mockResolvedValue(RETURN_USER);
  userService.createUser.mockResolvedValue(RETURN_USER);
});

describe('API: User', () => {
  describe('ROUTERS', () => {
    describe('POST /api/users/create', () => {
      it('returns status 201', async () => {
        const res = await request.post('/api/users/create').send(NEW_USER);
        expect.assertions(2);
        expect(userService.createUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
      });

      it('returns a user', async () => {
        const res = await request.post('/api/users/create').send(NEW_USER);
        const user = res.body;
        expect.assertions(2);
        expect(userService.createUser.mock.calls.length).toBe(1);
        expect(UserSchema.safeParse(user).success).toBe(true);
      });

      it('strips invalid fields from data', async () => {
        const res = await request.post('/api/users/create').send({ ...NEW_USER, invalidField: 'qwerty123' });
        expect.assertions(3);
        expect(userService.createUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty('invalidField');
      });

      it('returns status 400 when data is missing required fields', async () => {
        const res = await request.post('/api/users/create').send({
          keycloak_uuid: ID
        });
        expect.assertions(2);
        expect(userService.createUser.mock.calls.length).toBe(0);
        expect(res.status).toBe(400);
      });
    });

    describe('GET /api/users/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        userService.getUserById.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.get(`/api/users/${ID}`);
        expect.assertions(2);
        expect(userService.getUserById.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 200', async () => {
        const res = await request.get(`/api/users/${ID}`);
        expect.assertions(2);
        expect(userService.getUserById.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns a user', async () => {
        const res = await request.get(`/api/users/${ID}`);
        expect.assertions(2);
        expect(userService.getUserById.mock.calls.length).toBe(1);
        expect(UserSchema.safeParse(res.body).success).toBe(true);
      });
    });

    describe('PATCH /api/users/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        userService.updateUser.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.patch(`/api/users/${ID}`).send({ user_identifier: 'CRITTERBASE' });
        expect.assertions(2);
        expect(userService.updateUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 400 when paramaters are invalid', async () => {
        userService.updateUser.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.patch(`/api/users/${ID}`);
        expect.assertions(2);
        expect(userService.updateUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(400);
      });

      it('returns status 200', async () => {
        userService.updateUser.mockResolvedValue(RETURN_USER);
        const res = await request.patch(`/api/users/${ID}`).send({ user_identifier: 'CRITTERBASE' });
        expect.assertions(2);
        expect(userService.updateUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns a user', async () => {
        userService.updateUser.mockResolvedValue(RETURN_USER);
        const res = await request.patch(`/api/users/${ID}`).send({ user_identifier: 'CRITTERBASE' });
        expect.assertions(2);
        expect(userService.updateUser.mock.calls.length).toBe(1);
        expect(UserSchema.safeParse(res.body).success).toBe(true);
      });
    });
  });
});
