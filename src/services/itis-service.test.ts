import { ItisService } from "./itis-service";
import axios from "axios";
import { IItisGetFullHierarchyResponse } from "./itis-response-types";

jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;

const focalTsn = 180703;
const childTsn = 898418;

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

describe("ItisService", () => {
  const ORIGINAL_ENV = process.env;

  beforeAll(() => {
    process.env.ITIS_WEB_SERVICE = "itis";
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe("constructor", () => {
    it("should set web service url with env", () => {
      const service = new ItisService();
      expect(service.webServiceUrl).toBe("itis");
    });
  });

  describe("private methods", () => {
    describe("_itisGetRequest", () => {
      it("should format the request url correctly", async () => {
        const service = new ItisService();
        axiosMock.get.mockResolvedValue({ data: "test" });
        const data = await service._itisGetRequest("endpoint", "query");

        expect(axiosMock.get.mock.calls[0][0]).toBe("itis/endpoint?query");
        expect(data).toBe("test");
      });

      it("should throw error if no response from ITIS", async () => {
        const service = new ItisService();
        axiosMock.get.mockResolvedValue({ data: undefined });
        try {
          await service._itisGetRequest("test");
        } catch (err) {
          expect(err.message).toBe("no response from ITIS endpoint: test");
        }
      });
    });
  });

  describe("methods", () => {
    const service = new ItisService();
    jest
      .spyOn(service, "_itisGetRequest")
      .mockImplementation(() => itisHierarchyMockRes as any);

    describe("getHierarchy", () => {
      it("should return hierarchy list", async () => {
        const data = await service.getHierarchy(focalTsn);
        expect(data).toBeDefined();
        expect(data.length).toBe(2);
      });

      it("should return filter out children", async () => {
        const data = await service.getHierarchy(focalTsn);
        data.forEach((taxon) => {
          expect(taxon.tsn).not.toBe(childTsn);
        });
      });

      it("should cast tsn to number", async () => {
        const data = await service.getHierarchy(focalTsn);
        data.forEach((taxon) => {
          expect(typeof taxon.tsn).toBe("number");
        });
      });
    });
  });
});
