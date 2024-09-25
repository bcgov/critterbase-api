import { getAllowList, getAuthToken, getAuthTokenAudience, getAuthUser } from './auth';

describe('auth', () => {
  describe('getAllowList', () => {
    it('should return a list of allowed audiences', () => {
      const prevENV = process.env;

      process.env.ALLOWED_AUD = 'aud1 aud2 aud3';

      const result = getAllowList();

      expect(result).toEqual(['aud1', 'aud2', 'aud3']);

      process.env = prevENV;
    });
  });

  describe('getAuthTokenAudience', () => {
    it('should return the token audience', () => {
      const token = { aud: 'audience' };

      const result = getAuthTokenAudience(token as any);

      expect(result).toEqual('audience');
    });

    it('should throw an error if the token audience is invalid', () => {
      const token = { aud: 123 };

      expect(() => getAuthTokenAudience(token as any)).toThrow();
    });
  });

  describe('getAuthToken', () => {
    it('should return the auth token from the headers', () => {
      expect(getAuthToken({ authorization: 'Bearer token' })).toEqual('token');
    });

    it('should throw an error when token not a string', () => {
      expect(() => getAuthToken({ authorization: undefined })).toThrow();
    });
  });

  describe('getAuthUser', () => {
    it('should return the auth user from the headers', () => {
      const headers = { user: '{"keycloak_guid": "AAA", "username": "SteveBrule"}' };

      expect(getAuthUser(headers as any)).toEqual({ keycloak_uuid: 'AAA', user_identifier: 'SteveBrule' });
    });

    it('should throw an error when user header is malformed', () => {
      expect(() => getAuthUser({ user: 'malformed' } as any)).toThrow();
    });
  });
});
