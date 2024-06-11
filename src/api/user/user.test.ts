import { user } from '@prisma/client';
import { apiError } from '../../utils/types';
import supertest from 'supertest';
import { makeApp } from '../../app';
import { prisma } from '../../utils/constants';
import {
  createUser as _createUser,
  upsertUser as _upsertUser,
  getUsers as _getUsers,
  getUser as _getUser,
  updateUser as _updateUser,
  deleteUser as _deleteUser,
  setUserContext as _setUserContext
} from './user.service';
import { CreateUser, UserSchema } from '../../schemas/user-schema';

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

// Mocked Prisma Calls
const create = jest.spyOn(prisma.user, 'create').mockImplementation();
const upsert = jest.spyOn(prisma.user, 'upsert').mockImplementation();
const findMany = jest.spyOn(prisma.user, 'findMany').mockImplementation();
const findUniqueOrThrow = jest.spyOn(prisma.user, 'findUniqueOrThrow').mockImplementation();
const update = jest.spyOn(prisma.user, 'update').mockImplementation();
const pDelete = jest.spyOn(prisma.user, 'delete').mockImplementation();
const queryRaw = jest.spyOn(prisma, '$queryRaw').mockImplementation();
const findFirst = jest.spyOn(prisma.user, 'findFirst').mockImplementation();

// Mocked Services
const createUser = jest.fn();
const upsertUser = jest.fn();
const getUsers = jest.fn();
const getUser = jest.fn();
const updateUser = jest.fn();
const deleteUser = jest.fn();
const setUserContext = jest.fn();

const request = supertest(
  makeApp({
    userService: {
      createUser,
      upsertUser,
      getUsers,
      getUser,
      updateUser,
      deleteUserById,
      setUserContext
    }
  } as any)
);

beforeEach(() => {
  //TODO: Reset mocked prisma calls?

  // Reset mocked services
  createUser.mockReset();
  upsertUser.mockReset();
  getUsers.mockReset();
  getUser.mockReset();
  updateUser.mockReset();
  deleteUser.mockReset();
  setUserContext.mockReset();

  // Set default returns
  getUsers.mockResolvedValue([RETURN_USER]);
  getUser.mockResolvedValue(RETURN_USER);
  createUser.mockResolvedValue(RETURN_USER);
});

describe('API: User', () => {
  //describe('SERVICES', () => {
  //  describe('createUser()', () => {
  //    it('returns a user', async () => {
  //      create.mockResolvedValue(RETURN_USER);
  //      const returnedUser = await _createUser(NEW_USER);
  //      expect.assertions(2);
  //      expect(prisma.user.create).toHaveBeenCalledTimes(1);
  //      expect(UserSchema.safeParse(returnedUser).success).toBe(true);
  //    });
  //
  //    it('returns an existing user if one exists', async () => {
  //      findFirst.mockResolvedValue(RETURN_USER);
  //      const returnedUser = await _createUser(NEW_USER);
  //      expect.assertions(3);
  //      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
  //      expect(prisma.user.create).not.toHaveBeenCalled();
  //      expect(UserSchema.safeParse(returnedUser).success).toBe(true);
  //    });
  //  });
  //  describe('upsertUser()', () => {
  //    it('returns a user', async () => {
  //      upsert.mockResolvedValue(RETURN_USER);
  //      const returnedUser = await _upsertUser(NEW_USER);
  //      expect.assertions(2);
  //      expect(prisma.user.upsert).toHaveBeenCalledTimes(1);
  //      expect(UserSchema.safeParse(returnedUser).success).toBe(true);
  //    });
  //  });
  //  describe('getUsers()', () => {
  //    it('returns an array of users with correct properties', async () => {
  //      findMany.mockResolvedValue([RETURN_USER]);
  //      const users = await _getUsers();
  //      expect.assertions(3);
  //      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
  //      expect(users).toBeInstanceOf(Array);
  //      expect(users.length).toBe(1);
  //    });
  //  });
  //
  //  describe('getUser()', () => {
  //    it('returns a user when given a valid user ID', async () => {
  //      findUniqueOrThrow.mockResolvedValue(RETURN_USER);
  //      const returnedUser = await _getUser(ID);
  //      expect.assertions(2);
  //      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
  //      expect(UserSchema.safeParse(returnedUser).success).toBe(true);
  //    });
  //
  //    it('throws error when given an invalid user ID', async () => {
  //      findUniqueOrThrow.mockRejectedValue(new Error());
  //      await expect(_getUser(ID)).rejects.toThrow();
  //    });
  //  });
  //
  //  describe('updateUser()', () => {
  //    it('returns a user with the updated data', async () => {
  //      update.mockResolvedValue(RETURN_USER);
  //      const returnedUser = await _updateUser(ID, NEW_USER);
  //      expect.assertions(2);
  //      expect(prisma.user.update).toHaveBeenCalledTimes(1);
  //      expect(UserSchema.safeParse(returnedUser).success).toBe(true);
  //    });
  //  });
  //
  //  describe('deleteUser()', () => {
  //    it('returns deleted user and removes user from database', async () => {
  //      pDelete.mockResolvedValue(RETURN_USER);
  //      const deletedUser = await _deleteUser(ID);
  //      expect.assertions(3);
  //      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
  //      expect(prisma.user.delete).toHaveBeenCalledWith({
  //        where: { user_id: ID }
  //      });
  //      expect(UserSchema.safeParse(deletedUser).success).toBe(true);
  //    });
  //  });
  //
  //  describe('setUserContext()', () => {
  //    it('sets the user context with provided user_id and system_name', async () => {
  //      queryRaw.mockResolvedValue([{ api_set_context: ID }]);
  //      const result = await _setUserContext(ID, 'CRITTERBASE');
  //      expect.assertions(3);
  //      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  //      expect(result).toBeDefined();
  //      expect(zodID.safeParse(result).success).toBe(true);
  //    });
  //  });
  //});

  describe('ROUTERS', () => {
    describe('GET /api/users', () => {
      it('returns status 200', async () => {
        const res = await request.get('/api/users');
        expect.assertions(2);
        expect(getUsers.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns an array', async () => {
        const res = await request.get('/api/users');
        expect.assertions(2);
        expect(getUsers.mock.calls.length).toBe(1);
        expect(res.body).toBeInstanceOf(Array);
      });

      it('returns users with correct properties', async () => {
        const res = await request.get('/api/users');
        const users = res.body;
        expect.assertions(2);
        expect(getUsers.mock.calls.length).toBe(1);
        for (const user of users) {
          expect(UserSchema.safeParse(user).success).toBe(true);
        }
      });
    });

    describe('POST /api/users/create', () => {
      it('returns status 201', async () => {
        const res = await request.post('/api/users/create').send(NEW_USER);
        expect.assertions(2);
        expect(createUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
      });

      it('returns a user', async () => {
        const res = await request.post('/api/users/create').send(NEW_USER);
        const user = res.body;
        expect.assertions(2);
        expect(createUser.mock.calls.length).toBe(1);
        expect(UserSchema.safeParse(user).success).toBe(true);
      });

      it('strips invalid fields from data', async () => {
        const res = await request.post('/api/users/create').send({ ...NEW_USER, invalidField: 'qwerty123' });
        expect.assertions(3);
        expect(createUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty('invalidField');
      });

      it('returns status 400 when data is missing required fields', async () => {
        const res = await request.post('/api/users/create').send({
          keycloak_uuid: ID
        });
        expect.assertions(2);
        expect(createUser.mock.calls.length).toBe(0);
        expect(res.status).toBe(400);
      });
    });

    describe('GET /api/users/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        getUser.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.get(`/api/users/${ID}`);
        expect.assertions(2);
        expect(getUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 200', async () => {
        const res = await request.get(`/api/users/${ID}`);
        expect.assertions(2);
        expect(getUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns a user', async () => {
        const res = await request.get(`/api/users/${ID}`);
        expect.assertions(2);
        expect(getUser.mock.calls.length).toBe(1);
        expect(UserSchema.safeParse(res.body).success).toBe(true);
      });
    });

    describe('PATCH /api/users/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        updateUser.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.patch(`/api/users/${ID}`).send({ user_identifier: 'CRITTERBASE' });
        expect.assertions(2);
        expect(updateUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 400 when paramaters are invalid', async () => {
        updateUser.mockImplementation(() => {
          throw apiError.requiredProperty('error');
        });
        const res = await request.patch(`/api/users/${ID}`);
        expect.assertions(2);
        expect(updateUser.mock.calls.length).toBe(0);
        expect(res.status).toBe(400);
      });

      it('returns status 200', async () => {
        updateUser.mockResolvedValue(RETURN_USER);
        const res = await request.patch(`/api/users/${ID}`).send({ user_identifier: 'CRITTERBASE' });
        expect.assertions(2);
        expect(updateUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns a user', async () => {
        updateUser.mockResolvedValue(RETURN_USER);
        const res = await request.patch(`/api/users/${ID}`).send({ user_identifier: 'CRITTERBASE' });
        expect.assertions(2);
        expect(updateUser.mock.calls.length).toBe(1);
        expect(UserSchema.safeParse(res.body).success).toBe(true);
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('returns status 404 when id does not exist', async () => {
        deleteUser.mockImplementation(() => {
          throw apiError.notFound('error');
        });
        const res = await request.delete(`/api/users/${ID}`);
        expect.assertions(2);
        expect(deleteUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });

      it('returns status 200', async () => {
        deleteUser.mockResolvedValue(RETURN_USER);
        const res = await request.delete(`/api/users/${ID}`);
        expect.assertions(2);
        expect(deleteUser.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });

      it('returns deleted user', async () => {
        deleteUser.mockResolvedValue(RETURN_USER);
        const res = await request.delete(`/api/users/${ID}`);
        expect.assertions(2);
        expect(deleteUser.mock.calls.length).toBe(1);
        expect(UserSchema.safeParse(res.body).success).toBe(true);
      });
    });
  });
});
