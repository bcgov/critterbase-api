import supertest from "supertest";
import { makeApp } from "../../app";
import { ICbDatabase, db } from "../../utils/database";
import { prisma } from "../../utils/constants";
const ids = ["a", "b"];

const tmbl = {
  taxon_marking_body_location_id: "2f2d655d-2fd8-4fd8-961a-f3ce7ec3fb40",
  taxon_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
  body_location: "Left Ear",
  description: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: "2023-06-02T18:59:36.955Z",
  update_timestamp: "2023-06-02T18:59:36.955Z",
};

const tcc = {
  collection_category_id: "077e8c5f-1e8a-410a-8583-709c92402763",
  taxon_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: "2023-06-02T18:59:36.502Z",
  update_timestamp: "2023-06-02 11:59:37.976822-07",
  lk_collection_category: {
    category_name: "Population Unit",
  },
};

const cu = {
  collection_unit_id: "3727f22e-9093-4c70-951b-74c172fa91a6",
  collection_category_id: "077e8c5f-1e8a-410a-8583-709c92402763",
  unit_name: "Atlin",
  description: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: "2023-06-02T18:59:36.835Z",
  update_timestamp: "2023-06-02T18:59:36.835Z",
};

const queryRaw = jest
  .spyOn(prisma, "$queryRaw")
  .mockImplementation()
  .mockResolvedValue([{ get_taxon_ids: ids }]);

const mockDB: Partial<Record<keyof ICbDatabase, any>> = {
  getTaxonMarkingBodyLocations: jest.fn(),
  getTaxonCollectionCategories: jest.fn(),
  getCollectionUnitsFromCategory: jest.fn(),
  getCollectionUnitsFromCategoryId: jest.fn(),
};

const request = supertest(makeApp(mockDB));

beforeEach(() => {
  mockDB.getTaxonMarkingBodyLocations.mockResolvedValue(tmbl);
  mockDB.getTaxonCollectionCategories.mockResolvedValue(tcc);
  mockDB.getCollectionUnitsFromCategory.mockResolvedValue(cu);
  mockDB.getCollectionUnitsFromCategoryId.mockResolvedValue(cu);
});

describe("SERVICES", () => {
  describe("getCollectionUnitsFromCategoryId", () => {
    it("returns collection units", async () => {
      const cu_findMany = jest
        .spyOn(prisma.xref_collection_unit, "findMany")
        .mockImplementation()
        .mockResolvedValue([cu] as any[]);
      const ret = await db.getCollectionUnitsFromCategoryId("test");
      expect(cu_findMany.mock.calls.length).toBe(1);
      expect(ret[0].collection_category_id).toBe(cu.collection_category_id);
    });
  });

  describe("getTaxonMarkingBodyLocations", () => {
    const findMany = jest
      .spyOn(prisma.xref_taxon_marking_body_location, "findMany")
      .mockImplementation()
      .mockResolvedValue([tmbl] as any);

    it("returns array of body locations", async () => {
      const ret = await db.getTaxonMarkingBodyLocations("id");
      expect(findMany.mock.calls.length).toBe(1);
      expect(findMany.mock.calls[0][0]).toBeDefined();
    });
    it("passes undefined to prisma function when no inherited ids", async () => {
      queryRaw.mockResolvedValue([{ get_taxon_ids: null }]);
      const ret = await db.getTaxonMarkingBodyLocations("id");
      expect(findMany.mock.calls.length).toBe(1);
      expect(findMany.mock.calls[0][0]).not.toBeDefined();
    });
  });
  describe("getTaxonCollectionCategories", () => {
    const findMany = jest
      .spyOn(prisma.xref_taxon_collection_category, "findMany")
      .mockImplementation()
      .mockResolvedValue([tcc] as any);

    it("returns array of collection categories", async () => {
      await db.getTaxonCollectionCategories("id");
      await db.getTaxonCollectionCategories();
      expect(findMany.mock.calls.length).toBe(2);
      expect(findMany.mock.calls[0][0]).toBeDefined();
      expect(findMany.mock.calls[0][0]?.where?.taxon_id).toBeDefined();
      expect(findMany.mock.calls[1][0]?.where?.taxon_id).not.toBeDefined();
    });
  });
  describe("getCollectionUnitsFromCategory", () => {
    const findMany = jest
      .spyOn(prisma.xref_taxon_collection_category, "findFirstOrThrow")
      .mockImplementation()
      .mockResolvedValue([tcc] as any);

    it("returns array of collection categories", async () => {
      const cat = "category name";
      const taxonCommon = "taxon common";
      const taxonLatin = "taxon latin";
      await db.getCollectionUnitsFromCategory(cat, taxonCommon, taxonLatin);
      await db.getCollectionUnitsFromCategory(cat, taxonCommon);
      await db.getCollectionUnitsFromCategory(cat, undefined, taxonLatin);
      expect(findMany.mock.calls.length).toBe(3);
      expect(
        findMany.mock.calls[0][0]?.where?.lk_taxon?.taxon_name_common
      ).toBeDefined();
      expect(
        findMany.mock.calls[0][0]?.where?.lk_taxon?.taxon_name_latin
      ).toBeDefined();
      expect(
        findMany.mock.calls[0][0]?.where?.lk_collection_category?.category_name
      ).toBeDefined();

      expect(
        findMany.mock.calls[1][0]?.where?.lk_taxon?.taxon_name_common
      ).toBeDefined();
      expect(
        findMany.mock.calls[1][0]?.where?.lk_taxon?.taxon_name_latin
      ).not.toBeDefined();
      expect(
        findMany.mock.calls[1][0]?.where?.lk_collection_category?.category_name
      ).toBeDefined();

      expect(
        findMany.mock.calls[2][0]?.where?.lk_taxon?.taxon_name_common
      ).not.toBeDefined();
      expect(
        findMany.mock.calls[2][0]?.where?.lk_taxon?.taxon_name_latin
      ).toBeDefined();
      expect(
        findMany.mock.calls[2][0]?.where?.lk_collection_category?.category_name
      ).toBeDefined();
    });
  });
});
describe("ROUTERS", () => {
  describe("GET /taxon-marking-body-locations", () => {
    it("should parse taxon_id from schema and pass to service", async () => {
      const res = await request.get(
        `/api/xref/taxon-marking-body-locations?taxon_id=${tmbl.taxon_id}`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getTaxonMarkingBodyLocations.mock.calls[0][0]).toBe(
        tmbl.taxon_id
      );
      expect(mockDB.getTaxonMarkingBodyLocations.mock.calls.length).toBe(1);
      expect(res.body.taxon_marking_body_location_id).toBe(
        tmbl.taxon_marking_body_location_id
      );
    });
    it("can format response 'asSelect'", async () => {
      const res = await request.get(
        `/api/xref/taxon-marking-body-locations?taxon_id=${tmbl.taxon_id}&format=asSelect`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getTaxonMarkingBodyLocations.mock.calls[0][0]).toBe(
        tmbl.taxon_id
      );
      expect(mockDB.getTaxonMarkingBodyLocations.mock.calls.length).toBe(1);
      expect(res.body).toEqual({
        id: tmbl.taxon_marking_body_location_id,
        key: "taxon_marking_body_location_id",
        value: tmbl.body_location,
      });
    });
  });
  describe("GET /taxon-collection-categories", () => {
    it("should parse taxon_id from schema and pass to service", async () => {
      const res = await request.get(
        `/api/xref/taxon-collection-categories?taxon_id=${tcc.taxon_id}`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getTaxonCollectionCategories.mock.calls[0][0]).toBe(
        tcc.taxon_id
      );
      expect(mockDB.getTaxonCollectionCategories.mock.calls.length).toBe(1);
      expect(res.body.collection_category_id).toBe(tcc.collection_category_id);
    });
    it("can format response 'asSelect'", async () => {
      const res = await request.get(
        `/api/xref/taxon-collection-categories?taxon_id=${tmbl.taxon_id}&format=asSelect`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getTaxonCollectionCategories.mock.calls[0][0]).toBe(
        tcc.taxon_id
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
        `/api/xref/collection-units?category_id=${cu.collection_category_id}`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategoryId.mock.calls[0][0]).toBe(
        cu.collection_category_id
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
        `/api/xref/collection-units?category_name=${cu.unit_name}`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][0]).toBe(
        cu.unit_name
      );
      expect(mockDB.getCollectionUnitsFromCategoryId.mock.calls.length).toBe(0);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls.length).toBe(1);
    });
    it("should pass category_name, taxon_name_common and taxon_name_lating if provided", async () => {
      const common = "common";
      const latin = "latin";
      const res = await request.get(
        `/api/xref/collection-units?category_name=${cu.unit_name}&taxon_name_common=${common}&taxon_name_latin=${latin}`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][0]).toBe(
        cu.unit_name
      );
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][1]).toBe(
        common
      );
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][2]).toBe(
        latin
      );
      expect(mockDB.getCollectionUnitsFromCategoryId.mock.calls.length).toBe(0);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls.length).toBe(1);
    });
    it("can format response 'asSelect'", async () => {
      const res = await request.get(
        `/api/xref/collection-units?category_name=${cu.unit_name}&format=asSelect`
      );
      expect(res.status).toBe(200);
      expect(mockDB.getCollectionUnitsFromCategory.mock.calls[0][0]).toBe(
        cu.unit_name
      );
      expect(res.body).toEqual({
        id: cu.collection_unit_id,
        key: "collection_unit_id",
        value: cu.unit_name,
      });
    });
  });
});
