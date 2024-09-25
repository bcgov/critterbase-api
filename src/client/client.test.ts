import * as ctx from '../utils/context';
import { getDBClient, transaction } from './client';

describe('client.ts', () => {
  describe('getDBClient', () => {
    it('should return the database client', () => {
      const client = getDBClient();

      expect(client).toBeDefined();
      expect(client).toHaveProperty('$connect');
    });
  });

  describe('transaction', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('should execute the callback in transaction and return data', async () => {
      const ctxMock = {
        user_id: '00000000-0000-0000-0000-000000000000',
        keycloak_uuid: '0064CF4823A644309BE399C34B6B0F43',
        system_name: 'CRITTERBASE',
        user_identifier: 'MOCK'
      };

      const mockCallback = jest.fn().mockResolvedValue(true);
      const mockTxClient = {};
      const mockClient: any = { $transaction: jest.fn().mockImplementation((cb) => cb(mockTxClient)) };
      const setDBContextSpy = jest.spyOn(ctx, 'setDBContext').mockResolvedValue();

      const result = await transaction(ctxMock, mockClient, mockCallback);

      expect(setDBContextSpy).toHaveBeenCalledWith({
        txClient: mockTxClient,
        keycloak_uuid: ctxMock.keycloak_uuid,
        system_name: ctxMock.system_name
      });

      expect(mockClient.$transaction).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockTxClient);
      expect(result).toBe(true);
    });

    it('should throw error if transaction takes longer than allowed', async () => {
      const ctxMock = {
        user_id: '00000000-0000-0000-0000-000000000000',
        keycloak_uuid: '0064CF4823A644309BE399C34B6B0F43',
        system_name: 'CRITTERBASE',
        user_identifier: 'MOCK'
      };

      const mockTxClient = {};
      const mockClient: any = { $transaction: jest.fn().mockImplementation((cb) => cb(mockTxClient)) };
      const setDBContextSpy = jest.spyOn(ctx, 'setDBContext').mockResolvedValue();

      try {
        await transaction(
          ctxMock,
          mockClient,
          async () => {
            jest.advanceTimersByTime(1);
            return true;
          },
          1
        );
        fail();
      } catch (err) {
        expect(err.message).toBe('Transaction request took longer than 1 ms rolling back...');
      }
      expect(mockClient.$transaction).toHaveBeenCalled();
      expect(setDBContextSpy).toHaveBeenCalledWith({
        txClient: mockTxClient,
        keycloak_uuid: ctxMock.keycloak_uuid,
        system_name: ctxMock.system_name
      });
    });
  });
});
