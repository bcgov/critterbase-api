import axios from "axios";
import {
  IItisGetFullHierarchyResponse,
  IItisSolrStub,
} from "../schemas/itis-schema";
import { ItisWebService } from "../services/itis-service";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;

const focalTsn = 180703;
const childTsn = 898418;

const itisSolrMockRes: IItisSolrStub = {
  response: {
    numFound: 2,
    docs: [
      { tsn: String(focalTsn), nameWOInd: "Taxon A" },
      { tsn: String(childTsn), nameWOInd: "Taxon B" },
    ],
  },
};

const itisHierarchyMockRes: Partial<IItisGetFullHierarchyResponse> = {
  hierarchyList: [
    {
      author: "Gray, 1821",
      class: "gov.usgs.itis.itis_service.data.SvcHierarchyRecord",
      parentName: "Capreolinae",
      parentTsn: "552369",
      rankName: "Genus",
      taxonName: "Alces",
      tsn: "180702",
    },
    {
      author: "(Linnaeus, 1758)",
      class: "gov.usgs.itis.itis_service.data.SvcHierarchyRecord",
      parentName: "Alces",
      parentTsn: "180702",
      rankName: "Species",
      taxonName: "Alces alces",
      tsn: `${focalTsn}`,
    },
    {
      author: "(Linnaeus, 1758)",
      class: "gov.usgs.itis.itis_service.data.SvcHierarchyRecord",
      parentName: "Alces alces",
      parentTsn: "180703",
      rankName: "Subspecies",
      taxonName: "Alces alces alces",
      tsn: `${childTsn}`,
    },
  ],
};

describe("ItisWebService", () => {
  const ORIGINAL_ENV = process.env;

  beforeAll(() => {
    process.env.ITIS_WEB_SERVICE = "itis";
    process.env.ITIS_SOLR_SERVICE = "solr";
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe("constructor", () => {
    it("should set web service + solr url with envs", () => {
      const service = new ItisWebService();
      expect(service.webServiceUrl).toBe("itis");
      expect(service.solrServiceUrl).toBe("solr");
    });
  });

  describe("private methods", () => {
    describe("_itisWebServiceGetRequest", () => {
      it("should format the request url correctly", async () => {
        const service = new ItisWebService();
        axiosMock.get.mockResolvedValue({ data: "test" });
        const data = await service._itisWebServiceGetRequest(
          "endpoint",
          "query",
        );

        expect(axiosMock.get.mock.calls[0][0]).toBe("itis/endpoint?query");
        expect(data).toBe("test");
      });

      it("should throw error if no response from axios request", async () => {
        const service = new ItisWebService();
        axiosMock.get.mockResolvedValue({ data: undefined });
        expect(async () => {
          await service._itisWebServiceGetRequest("test");
        }).rejects.toThrow();
      });
    });

    describe("_itisSolrSearch", () => {
      it("should format the request url correctly", async () => {
        const service = new ItisWebService();
        axiosMock.get.mockResolvedValue({ data: "test" });
        const data = await service._itisSolrSearch("query");

        expect(axiosMock.get.mock.calls[0][0]).toBe(
          "solr/?wt=json&omitHeader=true&q=query",
        );
        expect(data).toBe("test");
      });

      it("should throw error if no response from axios request", async () => {
        const service = new ItisWebService();
        axiosMock.get.mockResolvedValue({ data: undefined });
        expect(async () => {
          await service._itisSolrSearch("test");
        }).rejects.toThrowError();
      });
    });
  });

  describe("methods", () => {
    const service = new ItisWebService();
    const webServiceSpy = jest.spyOn(service, "_itisWebServiceGetRequest");
    const solrSearchSpy = jest.spyOn(service, "_itisSolrSearch");

    beforeEach(() => {
      webServiceSpy.mockClear();
      solrSearchSpy.mockClear();
    });

    describe("getTsnHierarchy", () => {
      webServiceSpy.mockImplementation(() =>
        Promise.resolve(itisHierarchyMockRes),
      );

      it("should return hierarchy list", async () => {
        const data = await service.getTsnHierarchy(focalTsn);
        expect(data).toBeDefined();
        expect(data.length).toBe(2);
      });

      it("should return filter out children", async () => {
        const data = await service.getTsnHierarchy(focalTsn);
        data.forEach((tsn) => {
          expect(tsn).not.toBe(childTsn);
        });
      });

      it("should cast tsn to number", async () => {
        const data = await service.getTsnHierarchy(focalTsn);
        data.forEach((tsn) => {
          expect(typeof tsn).toBe("number");
        });
      });

      it("should throw error if no hierarchy returned", async () => {
        webServiceSpy.mockImplementation(() =>
          Promise.resolve({ hierarchyList: [] }),
        );

        expect(async () => {
          await service.getTsnHierarchy(focalTsn);
        }).rejects.toThrow("ITIS returned no hierarchy for this TSN");
      });
    });

    describe("isValueTsn", () => {
      it("should be true if tsn exists in payload", async () => {
        webServiceSpy.mockImplementation(() => Promise.resolve({ tsn: 1 }));
        const data = await service.isValueTsn(1);
        expect(data).toBeTruthy();
      });

      it("should be false if response undefined", async () => {
        webServiceSpy.mockImplementation(() => Promise.resolve());
        const data = await service.isValueTsn(1);
        expect(data).toBeFalsy();
      });

      it("should be false if response contains different TSN", async () => {
        webServiceSpy.mockImplementation(() => Promise.resolve(2));
        const data = await service.isValueTsn(1);
        expect(data).toBeFalsy();
      });
    });

    describe("getScientificNameFromTsn", () => {
      it("should inject query to solr search", async () => {
        solrSearchSpy.mockImplementation(() =>
          Promise.resolve({ response: { docs: [{ tsn: "1" }] } }),
        );
        await service.getScientificNameFromTsn(1);
        expect(solrSearchSpy.mock.calls[0][0]).toBe("tsn:1");
      });

      it("should throw error if unable to find matching tsn", async () => {
        solrSearchSpy.mockImplementation(() =>
          Promise.resolve({ response: { docs: [{ tsn: "2" }] } }),
        );
        try {
          const data = await service.getScientificNameFromTsn(1);
        } catch (err) {
          expect(err.message).toBe(
            `Unable to find scientific name for ITIS TSN`,
          );
        }
      });

      it("should return scientific name if tsn matches in response", async () => {
        solrSearchSpy.mockImplementation(() =>
          Promise.resolve({
            response: { docs: [{ tsn: "2", nameWOInd: "science" }] },
          }),
        );
        const data = await service.getScientificNameFromTsn(2);
        expect(data).toBe("science");
      });
    });

    describe("getTsnFromScientificName", () => {
      it("should inject query to solr search with encoded space characters", async () => {
        solrSearchSpy.mockImplementation(() =>
          Promise.resolve({
            response: { docs: [{ tsn: "1", nameWOInd: "test test" }] },
          }),
        );
        await service.getTsnFromScientificName("test test");
        expect(solrSearchSpy.mock.calls[0][0]).toBe("nameWOInd:test\\%20test");
      });

      it("should throw error if unable to find scientific name", async () => {
        solrSearchSpy.mockImplementation(() =>
          Promise.resolve({
            response: { docs: [{ tsn: "2", nameWOInd: "test" }] },
          }),
        );
        expect(async () => {
          await service.getTsnFromScientificName("bad");
        }).rejects.toThrowError(
          "Unable to translate scientific name to ITIS TSN",
        );
      });

      it("should return tsn if match of scientific name in response", async () => {
        solrSearchSpy.mockImplementation(() =>
          Promise.resolve({
            response: { docs: [{ tsn: "2", nameWOInd: "test" }] },
          }),
        );
        const response = await service.getTsnFromScientificName("test");
        expect(response).toBe(2);
      });
    });
  });
});
