import { ExternalService, Service } from './base-service';

describe('Base Classes', () => {
  describe('Service', () => {
    describe('constructor', () => {
      it('should inject repository as dependency', () => {
        const mockRepo: any = jest.fn();
        const service = new Service(mockRepo);
        expect(service.repository).toBe(mockRepo);
      });
    });
  });

  describe('ExternalService', () => {
    describe('constructor', () => {
      it('should inject repository as dependency', () => {
        const service = new ExternalService('http://test.com');
        expect(service.externalServiceUrl).toBe('http://test.com');
      });
    });
  });
});
