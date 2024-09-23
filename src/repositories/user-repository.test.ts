import { UserRepository } from './user-repository';

describe('UserRepository', () => {
  describe('createUser', () => {
    it('should return user if found by keycloak uuid', async () => {
      const mockPrisma = { user: { create: jest.fn().mockResolvedValue('user') } };

      const userRespository = new UserRepository(mockPrisma);

      const user = await userRespository.createUser({ keycloak_uuid: 'BLAH', user_identifier: 'A' });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { keycloak_uuid: 'BLAH', user_identifier: 'A' },
        select: { user_id: true, keycloak_uuid: true, user_identifier: true }
      });

      expect(user).toEqual('user');
    });
  });

  describe('upsertUser', () => {
    it('should upsert a user', async () => {
      const mockPrisma = { user: { upsert: jest.fn().mockResolvedValue('user') } };

      const userRespository = new UserRepository(mockPrisma);

      const user = await userRespository.upsertUser({ keycloak_uuid: 'BLAH', user_identifier: 'A' });

      expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
        where: { keycloak_uuid: 'BLAH' },
        update: { keycloak_uuid: 'BLAH', user_identifier: 'A' },
        create: { keycloak_uuid: 'BLAH', user_identifier: 'A' },
        select: { user_id: true, keycloak_uuid: true, user_identifier: true }
      });

      expect(user).toEqual('user');
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockPrisma = { user: { findMany: jest.fn().mockResolvedValue(['user']) } };

      const userRespository = new UserRepository(mockPrisma);

      const users = await userRespository.getUsers();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        select: { user_id: true, keycloak_uuid: true, user_identifier: true }
      });

      expect(users).toEqual(['user']);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockPrisma = { user: { findUniqueOrThrow: jest.fn().mockResolvedValue('user') } };

      const userRespository = new UserRepository(mockPrisma);

      const user = await userRespository.getUserById('id');

      expect(mockPrisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { user_id: 'id' },
        select: { user_id: true, keycloak_uuid: true, user_identifier: true }
      });

      expect(user).toEqual('user');
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const mockPrisma = { user: { update: jest.fn().mockResolvedValue('user') } };

      const userRespository = new UserRepository(mockPrisma);

      const user = await userRespository.updateUser('id', { keycloak_uuid: 'BLAH', user_identifier: 'A' });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { user_id: 'id' },
        data: { keycloak_uuid: 'BLAH', user_identifier: 'A' },
        select: { user_id: true, keycloak_uuid: true, user_identifier: true }
      });

      expect(user).toEqual('user');
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by id', async () => {
      const mockPrisma = { user: { delete: jest.fn().mockResolvedValue('user') } };

      const userRespository = new UserRepository(mockPrisma);

      const user = await userRespository.deleteUserById('id');

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { user_id: 'id' },
        select: { user_id: true, keycloak_uuid: true, user_identifier: true }
      });

      expect(user).toEqual('user');
    });
  });

  describe('findUserByKeycloakUuid', () => {
    it('should return a user by keycloak uuid', async () => {
      const mockPrisma = { user: { findFirst: jest.fn().mockResolvedValue('user') } };

      const userRespository = new UserRepository(mockPrisma);

      const user = await userRespository.findUserByKeycloakUuid('id');

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { keycloak_uuid: 'id' }
      });

      expect(user).toEqual('user');
    });
  });
});
