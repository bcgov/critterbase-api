import supertest from "supertest";
import { makeApp } from "../../app";

const tsn = 1;

const mockXrefService = {
  getTsnMarkingBodyLocations: jest.fn(),
  getTaxonCollectionCategories: jest.fn(),
  // getCollectionUnitsFromCategory: jest.fn(),
  // getCollectionUnitsFromCategoryId: jest.fn(),
};

const request = supertest(makeApp({ xrefService: mockXrefService } as any));

describe("ROUTERS", () => {
  describe("GET /taxon-marking-body-locations", () => {
    it("should respond status 200 and pass query to service", async () => {
      const res = await request
        .get(`/api/xref/taxon-marking-body-locations`)
        .query({ tsn: 1 });
      expect(res.status).toBe(200);
      expect(mockXrefService.getTsnMarkingBodyLocations.mock.calls[0][0]).toBe(
        1,
      );
      expect(res.body).toBe(true);
    });
  });
  describe("GET /taxon-collection-categories", () => {
    it("should parse taxon_id from schema and pass to service", async () => {
      const res = await request.get(
        `/api/xref/taxon-collection-categories?taxon_id=${tsn}`,
      );
      expect(res.status).toBe(200);
      expect(
        mockXrefService.getTaxonCollectionCategories.mock.calls[0][0],
      ).toBe(tsn);
      expect(
        mockXrefService.getTaxonCollectionCategories.mock.calls.length,
      ).toBe(1);
    });
    it("can format response 'asSelect'", async () => {
      const res = await request.get(
        `/api/xref/taxon-collection-categories?taxon_id=${tmbl.taxon_id}&format=asSelect`,
      );
      expect(res.status).toBe(200);
      expect(mockDB.getTaxonCollectionCategories.mock.calls[0][0]).toBe(
        tcc.taxon_id,
      );
      expect(mockDB.getTaxonCollectionCategories.mock.calls.length).toBe(1);
      expect(res.body).toEqual({
        id: tcc.collection_category_id,
        key: "collection_category_id",
        value: tcc.lk_collection_category.category_name,
      });
    });
  });
  describe("GET /collection-units", () => {
    it("should parse category_id if provided", async () => {
      const res = await request.get(
        `/api/xref/collection-units?category_id=${cu.collection_category_id}`,
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategoryId.mock.calls[0][0]).toBe(
        cu.collection_category_id,
      );
      expect(mockDB.getCollectionUnitsFromCategoryId.mock.calls.length).toBe(1);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls.length).toBe(0);
    });
    it("should respond with error if no query params provided", async () => {
      const res = await request.get(`/api/xref/collection-units`);
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
    it("should pass category_name if provided", async () => {
      const res = await request.get(
        `/api/xref/collection-units?category_name=${cu.unit_name}`,
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][0]).toBe(
        cu.unit_name,
      );
      expect(mockDB.getCollectionUnitsFromCategoryId.mock.calls.length).toBe(0);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls.length).toBe(1);
    });
    it("should pass category_name, taxon_name_common and taxon_name_lating if provided", async () => {
      const common = "common";
      const latin = "latin";
      const res = await request.get(
        `/api/xref/collection-units?category_name=${cu.unit_name}&taxon_name_common=${common}&taxon_name_latin=${latin}`,
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][0]).toBe(
        cu.unit_name,
      );
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][1]).toBe(
        common,
      );
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][2]).toBe(
        latin,
      );
      expect(mockDB.getCollectionUnitsFromCategoryId.mock.calls.length).toBe(0);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls.length).toBe(1);
    });
    it("can format response 'asSelect'", async () => {
      const res = await request.get(
        `/api/xref/collection-units?category_name=${cu.unit_name}&format=asSelect`,
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][0]).toBe(
        cu.unit_name,
      );
      expect(res.body).toEqual({
        id: cu.collection_unit_id,
        key: "collection_unit_id",
        value: cu.unit_name,
      });
    });
  });
});
