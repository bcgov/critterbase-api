import * as client from '../client/client';
import { ICbDatabase } from './database';

type DBServices = Partial<Record<keyof ICbDatabase['services'], unknown>>;
type DBProps = Partial<Record<keyof ICbDatabase, unknown>>;

// Mock context object
export const mockContext = {
  user_id: '00000000-0000-0000-0000-000000000000',
  keycloak_uuid: '0064CF4823A644309BE399C34B6B0F43',
  system_name: 'CRITTERBASE',
  user_identifier: 'MOCK'
};

// Mock client object, can be improved upon to include more properties if useful
export const mockClient = {};

// Mock context function that returns the mock context object
const getContextMock = jest.fn().mockReturnValue(mockContext);

// Mock client function that returns the mock client object
const getDBClientMock = jest.fn().mockReturnValue(mockClient);

// Mock transaction function that calls the callback function with the mock client
const transactionMock = jest
  .spyOn(client, 'transaction')
  .mockImplementation((_ctx, _client, txCallback) => txCallback(_client));

/**
 * Mock getDBMock function that returns a mock database object (passed to the app)
 *
 * @param {DBServices} serviceMethodMocks - Partial object of service methods to mock
 * @param {DBProps} [propOverrides] - Partial object of properties to override
 *
 */
export const getDBMock = (serviceMethodMocks: DBServices, propOverrides?: DBProps) => {
  return {
    ...propOverrides,
    getDBClient: getDBClientMock,
    getContext: getContextMock,
    transaction: transactionMock,
    services: {
      UserService: { init: jest.fn().mockReturnValue(serviceMethodMocks.UserService) },
      BulkService: { init: jest.fn().mockReturnValue(serviceMethodMocks.BulkService) },
      MortalityService: { init: jest.fn().mockReturnValue(serviceMethodMocks.MortalityService) },
      CaptureService: { init: jest.fn().mockReturnValue(serviceMethodMocks.CaptureService) }
    }
  };
};
