import { getContext, setDBContext } from './context';

describe('context.ts', () => {
  describe('getContext', () => {
    it('should return context', () => {
      const req = {
        context: {
          user_id: '00000000-0000-0000-0000-000000000000',
          keycloak_uuid: '0064CF4823A644309BE399C34B6B0F43',
          system_name: 'CRITTERBASE',
          user_identifier: 'MOCK'
        }
      };

      expect(getContext(req)).toStrictEqual(req.context);
    });
  });

  describe('setDBContext', () => {
    it('should pass the correct values to the query', async () => {
      const txClientMock = { $queryRaw: jest.fn() };

      setDBContext({ txClient: txClientMock, keycloak_uuid: 'keycloak_uuid', system_name: 'system_name' });

      expect(txClientMock.$queryRaw).toHaveBeenCalled();
    });
  });
});
