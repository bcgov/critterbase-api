import * as client from '../client/client';
import { ICbDatabase } from './database';

export const mockContext = {
  user_id: '00000000-0000-0000-0000-000000000000',
  keycloak_uuid: '0064CF4823A644309BE399C34B6B0F43',
  system_name: 'CRITTERBASE',
  user_name: 'MOCK'
};

export const mockClient = {};

export const getContextMock = jest.fn().mockReturnValue(mockContext);

export const transactionMock = jest
  .spyOn(client, 'transaction')
  .mockImplementation((_ctx, _client, txCallback) => txCallback(_client));

export const getDBMock = (serviceMethodMocks: Partial<Record<keyof ICbDatabase['services'], unknown>>) => {
  return {
    getDBClient: jest.fn().mockReturnValue(mockClient),
    getContext: getContextMock,
    transaction: transactionMock,
    services: {
      UserService: { init: jest.fn().mockReturnValue(serviceMethodMocks.UserService) }
    }
  };
};
