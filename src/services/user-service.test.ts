import { UserService } from './user-service';

describe('user-service', () => {
  let repository;
  const userService = UserService.init();

  describe('init', () => {
    it('should instantiate UserService with all its dependencies', () => {
      expect(userService).toBeInstanceOf(UserService);
      expect(userService.repository).toBeDefined();
    });
  });

  describe('createOrGetUser', () => {
    it('should call correct repository method', async () => {
      repository = { createOrGetUser: jest.fn() };

      const userService = new UserService(repository);
      await userService.createOrGetUser({ keycloak_uuid: 'BLAH', user_identifier: 'A' });
      expect(repository.createOrGetUser).toHaveBeenCalled();
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

  describe('getUserByKeycloakUuid', () => {
    it('should call correct repository method and pass id', async () => {
      repository = { getUserByKeycloakUuid: jest.fn() };

      const userService = new UserService(repository);
      await userService.getUserByKeycloakUuid('id');
      expect(repository.getUserByKeycloakUuid).toHaveBeenCalledWith('id');
    });
  });

  describe('loginUser', () => {
    it('should call correct repository method and pass id', async () => {
      repository = {
        createOrGetUser: jest.fn().mockResolvedValue({ keycloak_uuid: 'A' }),
        setDatabaseUserContext: jest.fn()
      };

      const userService = new UserService(repository);
      await userService.loginUser({ keycloak_uuid: 'B', user_identifier: 'Carl', system_name: 'TEST' });
      expect(repository.createOrGetUser).toHaveBeenCalledWith({ keycloak_uuid: 'B', user_identifier: 'Carl' });
      expect(repository.setDatabaseUserContext).toHaveBeenCalledWith('A', 'TEST');
    });
  });
});
