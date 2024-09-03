import axios from 'axios';
import { ItisService } from '../services/itis-service';
jest.mock('axios');

const axiosMock = axios as jest.Mocked<typeof axios>;

const focalTsn = 180703;
const childTsn = 898418;

describe('ItisService', () => {
  const ORIGINAL_ENV = process.env;

  beforeAll(() => {
    process.env.ITIS_WEB_SERVICE = 'itis';
    process.env.ITIS_SOLR_SERVICE = 'solr';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('constructor', () => {
    it('should set web service + solr url with envs', () => {
      const service = new ItisService();
      expect(service.externalServiceUrl).toBe('itis');
      expect(service.solrServiceUrl).toBe('solr');
    });
  });

  describe('private methods', () => {
    describe('_itisWebServiceGetRequest', () => {
      it('should format the request url correctly', async () => {
        const service = new ItisService();
        axiosMock.get.mockResolvedValue({ data: 'test' });
        const data = await service._itisWebServiceGetRequest('endpoint', 'query');

        expect(axiosMock.get.mock.calls[0][0]).toBe('itis/endpoint?query');
        expect(data).toBe('test');
      });

      it('should catch and re-throw axios error', async () => {
        const service = new ItisService();
        axiosMock.get.mockRejectedValue({ data: undefined });
        try {
          await service._itisWebServiceGetRequest('test');
        } catch (err) {
          expect(err.message).toBe(`No response from ITIS Web Service`);
        }
      });
    });

    describe('_itisSolrSearch', () => {
      it('should format the request url correctly', async () => {
        const service = new ItisService();
        axiosMock.get.mockResolvedValue({
          data: { response: { docs: true } }
        });
        const data = await service._itisSolrSearch('query');

        expect(axiosMock.get.mock.calls[0][0]).toBe('solr/?wt=json&omitHeader=true&q=query');
        expect(data).toBeTruthy();
      });

      it('should throw error if no response from axios request', async () => {
        const service = new ItisService();
        axiosMock.get.mockRejectedValue({ data: undefined });
        try {
          await service._itisSolrSearch('test');
        } catch (err) {
          expect(err.message).toBe(`No response from ITIS Solr Service`);
        }
      });
    });
  });

  describe('methods', () => {
    const service = new ItisService();
    const webServiceSpy = jest.spyOn(service, '_itisWebServiceGetRequest');
    const solrSearchSpy = jest.spyOn(service, '_itisSolrSearch');
    const searchTsnSpy = jest.spyOn(service, 'searchSolrByTsn');

    beforeEach(() => {
      webServiceSpy.mockClear();
      solrSearchSpy.mockClear();
      searchTsnSpy.mockClear();
      searchTsnSpy.mockImplementation(() =>
        Promise.resolve({
          tsn: 1,
          tsnHierarchy: [0, 1],
          scientificName: 'Science'
        })
      );
      webServiceSpy.mockImplementation(() => Promise.reject({ tsnHierarchy: [] }));
      solrSearchSpy.mockImplementation(() =>
        Promise.resolve([{ nameWOInd: 'test test', tsn: '1', hierarchyTSN: ['$1$2$'] }])
      );
    });

    describe('getTsnHierarchy', () => {
      it('should return hierarchy list', async () => {
        const data = await service.getTsnHierarchy(1);
        expect(data).toBeDefined();
        expect(data.length).toBe(2);
      });

      it('should throw error if no hierarchy returned', async () => {
        expect(async () => {
          await service.getTsnHierarchy(focalTsn);
        }).rejects.toThrow('ITIS TSN produced invalid hierarchy.');
      });
    });

    describe('getScientificNameFromTsn', () => {
      it('should inject query to solr search', async () => {
        await service.getScientificNameFromTsn(1);
        expect(searchTsnSpy.mock.calls[0][0]).toBe(1);
      });

      it('should return scientific name if tsn matches in response', async () => {
        const data = await service.getScientificNameFromTsn(2);
        expect(data).toBe('Science');
      });
    });

    describe('getTsnFromScientificName', () => {
      it('should inject query to solr search with encoded space characters', async () => {
        await service.getTsnFromScientificName('test test');
        expect(solrSearchSpy.mock.calls[0][0]).toBe('nameWOInd:test\\%20test');
      });

      it('should throw error if unable to find scientific name', async () => {
        solrSearchSpy.mockImplementation(() => Promise.resolve([]));

        try {
          await service.getTsnFromScientificName('bad');
          expect(false);
        } catch (err: any) {
          expect(err.message).toBe('Unable to translate scientific name to ITIS TSN');
        }
      });

      it('should return tsn if match of scientific name in response', async () => {
        const response = await service.getTsnFromScientificName('test test');
        expect(response).toBe(1);
      });
    });

    describe('getTsnsHierarchy', () => {
      it('should format tsn query', async () => {
        await service.getTsnsHierarchy([1, 2]);
        expect(solrSearchSpy.mock.calls[0][0]).toBe('tsn:1+tsn:2');
      });

      it('should strip out duplicate tsns from array', async () => {
        await service.getTsnsHierarchy([1, 2, 2]);
        expect(solrSearchSpy.mock.calls[0][0]).toBe('tsn:1+tsn:2');
      });

      it('should return tsns with hierarchies', async () => {
        const response = await service.getTsnsHierarchy([1, 2]);
        const expectedResponse = [
          {
            tsn: 1,
            hierarchy: [1, 2]
          }
        ];
        expect(response).toStrictEqual(expectedResponse);
      });
    });

    describe('_splitSolrHierarchyStringToArray', () => {
      const result = service._splitSolrHierarchyStringToArray('$1$2$');
      expect(result).toStrictEqual([1, 2]);
    });
  });
});
