import supertest from "supertest";
import { makeApp } from "../../app";
import { XrefService } from "../../services/xref-service";

const tsn = 1;

const mockXrefService = {
  getTsnMarkingBodyLocations: jest.fn().mockResolvedValue(true),
  getTsnCollectionCategories: jest.fn().mockResolvedValue(true),
  getTsnMeasurements: jest.fn().mockResolvedValue(true),
  getTsnQualitativeMeasurements: jest.fn().mockResolvedValue(true),
  getTsnQuantitativeMeasurements: jest.fn().mockResolvedValue(true)
} satisfies Partial<Record<keyof Partial<XrefService>, jest.Mock>>;

const request = supertest(makeApp({ xrefService: mockXrefService } as any));

describe("ROUTER", () => {
  describe("GET taxon-collection-categories - get collection categories by tsn", () => {
    it("should respond with status 200 and return response", async () => {
      const res = await request
        .get("/api/xref/taxon-collection-categories")
        .query({ tsn });
      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
      expect(mockXrefService.getTsnCollectionCategories.mock.calls[0][0]).toBe(
        tsn
      );
    });
    it("should format the response asSelect", async () => {
      const res = await request
        .get("/api/xref/taxon-collection-categories")
        .query({ tsn, format: "asSelect" });
      expect(mockXrefService.getTsnCollectionCategories.mock.calls[0][1]).toBe(
        true
      );
    });
  });
  describe("GET taxon-marking-body-locations - get marking body locations by tsn", () => {
    it("should respond with status 200 and return response", async () => {
      const res = await request
        .get("/api/xref/taxon-marking-body-locations")
        .query({ tsn });
      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
      expect(mockXrefService.getTsnMarkingBodyLocations.mock.calls[0][0]).toBe(
        tsn
      );
    });
    it("should format the response asSelect", async () => {
      const res = await request
        .get("/api/xref/taxon-marking-body-locations")
        .query({ tsn, format: "asSelect" });
      expect(mockXrefService.getTsnMarkingBodyLocations.mock.calls[0][1]).toBe(
        true
      );
    });
  });
  describe("GET taxon-qualitative-measurements - get qualitative measurements by tsn", () => {
    it("should respond with status 200 and return response", async () => {
      const res = await request
        .get("/api/xref/taxon-qualitative-measurements")
        .query({ tsn });
      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
      expect(
        mockXrefService.getTsnQualitativeMeasurements.mock.calls[0][0]
      ).toBe(tsn);
    });
    it("should format the response asSelect", async () => {
      const res = await request
        .get("/api/xref/taxon-qualitative-measurements")
        .query({ tsn, format: "asSelect" });
      expect(
        mockXrefService.getTsnQualitativeMeasurements.mock.calls[0][1]
      ).toBe(true);
    });
  });
  describe("GET taxon-quantitative-measurements - get quantitative measurements by tsn", () => {
    it("should respond with status 200 and return response", async () => {
      const res = await request
        .get("/api/xref/taxon-quantitative-measurements")
        .query({ tsn });
      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
      expect(
        mockXrefService.getTsnQuantitativeMeasurements.mock.calls[0][0]
      ).toBe(tsn);
    });
    it("should format the response asSelect", async () => {
      const res = await request
        .get("/api/xref/taxon-quantitative-measurements")
        .query({ tsn, format: "asSelect" });
      expect(
        mockXrefService.getTsnQuantitativeMeasurements.mock.calls[0][1]
      ).toBe(true);
    });
  });
  describe("GET taxon-measurements - get quantitative/qualitative measurements by tsn", () => {
    it("should respond with status 200 and return response", async () => {
      const res = await request
        .get("/api/xref/taxon-measurements")
        .query({ tsn });
      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
      expect(mockXrefService.getTsnMeasurements.mock.calls[0][0]).toBe(tsn);
    });
    it("should format the response asSelect", async () => {
      const res = await request
        .get("/api/xref/taxon-measurements")
        .query({ tsn, format: "asSelect" });
      expect(mockXrefService.getTsnMeasurements.mock.calls[0][1]).toBe(true);
    });
  });
});
