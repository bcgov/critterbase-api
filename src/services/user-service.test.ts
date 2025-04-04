import { UserService } from './user-service';

describe('user-service', () => {
  let repository;

  describe('init', () => {
    it('should instantiate UserService with all its dependencies', () => {
      const userService = UserService.init({} as any);
      expect(userService).toBeInstanceOf(UserService);
      expect(userService.repository).toBeDefined();
    });
  });

  describe('createUser', () => {
    it('should call correct repository method', async () => {
      repository = { createUser: jest.fn() };

      const userService = new UserService(repository);
      await userService.createUser({ keycloak_uuid: 'BLAH', user_identifier: 'A' });
      expect(repository.createUser).toHaveBeenCalled();
    });
  });

  describe('upsertUser', () => {
    it('should call correct repository method and pass params', async () => {
      repository = { upsertUser: jest.fn() };

      const userService = new UserService(repository);
      await userService.upsertUser({ keycloak_uuid: 'BLAH', user_identifier: 'A' });
      expect(repository.upsertUser).toHaveBeenCalledWith({ keycloak_uuid: 'BLAH', user_identifier: 'A' });
    });
  });

  describe('getUsers', () => {
    it('should call correct repository method', async () => {
      repository = { getUsers: jest.fn() };

      const userService = new UserService(repository);
      await userService.getUsers();
      expect(repository.getUsers).toHaveBeenCalledWith();
    });
  });

  describe('getUserById', () => {
    it('should call correct repository method and pass user id', async () => {
      repository = { getUserById: jest.fn() };

      const userService = new UserService(repository);
      await userService.getUserById('a');
      expect(repository.getUserById).toHaveBeenCalledWith('a');
    });
  });

  describe('updateUser', () => {
    it('should call correct repository method and pass body', async () => {
      repository = { updateUser: jest.fn() };

      const userService = new UserService(repository);
      await userService.updateUser('A', { keycloak_uuid: 'BLAH', user_identifier: 'A' });
      expect(repository.updateUser).toHaveBeenCalledWith('A', { keycloak_uuid: 'BLAH', user_identifier: 'A' });
    });
  });

  describe('deleteUserById', () => {
    it('should call correct repository method and pass id', async () => {
      repository = { deleteUserById: jest.fn() };

      const userService = new UserService(repository);
      await userService.deleteUserById('id');
      expect(repository.deleteUserById).toHaveBeenCalledWith('id');
    });
  });

  describe('setDatabaseUserContext', () => {
    it('should call correct repository method and pass id', async () => {
      repository = { setDatabaseUserContext: jest.fn() };

      const userService = new UserService(repository);
      await userService.setDatabaseUserContext('id', 'system');
      expect(repository.setDatabaseUserContext).toHaveBeenCalledWith('id', 'system');
    });
  });

  describe('findUserByKeycloakUuid', () => {
    it('should call correct repository method and pass id', async () => {
      repository = { findUserByKeycloakUuid: jest.fn() };

      const userService = new UserService(repository);
      await userService.findUserByKeycloakUuid('id');
      expect(repository.findUserByKeycloakUuid).toHaveBeenCalledWith('id');
    });
  });

  describe('loginUser', () => {
    it('should only call the setDatabaseUserContext once when user exists', async () => {
      repository = {
        findUserByKeycloakUuid: jest.fn().mockResolvedValue({ keycloak_uuid: 'user_keycloak' }),
        setDatabaseUserContext: jest.fn()
      };

      const userService = new UserService(repository);
      const user = await userService.loginUser({ keycloak_uuid: 'id', user_identifier: 'A', system_name: 'system' });

      expect(repository.findUserByKeycloakUuid).toHaveBeenCalledWith('id');
      expect(repository.setDatabaseUserContext).toHaveBeenCalledTimes(1);
      expect(repository.setDatabaseUserContext).toHaveBeenCalledWith('user_keycloak', 'system');

      expect(user).toEqual({ keycloak_uuid: 'user_keycloak' });
    });

    it('should call the setDatabaseUserContext twice when user does not exist', async () => {
      repository = {
        findUserByKeycloakUuid: jest.fn().mockResolvedValue(undefined),
        setDatabaseUserContext: jest.fn(),
        createUser: jest.fn().mockResolvedValue({ keycloak_uuid: 'user_keycloak' })
      };

      const userService = new UserService(repository);
      const user = await userService.loginUser({ keycloak_uuid: 'id', user_identifier: 'A', system_name: 'system' });

      expect(repository.findUserByKeycloakUuid).toHaveBeenCalledWith('id');
      expect(repository.setDatabaseUserContext).toHaveBeenCalledTimes(2);
      expect(repository.setDatabaseUserContext).toHaveBeenNthCalledWith(1, null, 'system');
      expect(repository.setDatabaseUserContext).toHaveBeenNthCalledWith(2, 'user_keycloak', 'system');

      expect(user).toEqual({ keycloak_uuid: 'user_keycloak' });
    });

    it('should format error if request fails', async () => {
      repository = {
        findUserByKeycloakUuid: jest.fn().mockRejectedValue(new Error('FAILED'))
      };

      const userService = new UserService(repository);

      try {
        await userService.loginUser({ keycloak_uuid: 'id', user_identifier: 'A', system_name: 'system' });
        fail();
      } catch (err) {
        expect(err.message).toBe('Login failed. User is not authorized');
      }
    });
  });
});
