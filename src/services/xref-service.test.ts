import { XrefService } from "./xref-service";

describe("xref-service", () => {
  const mockRepository: any = {
    getCollectionUnitsFromCategoryId: jest.fn(),
  };

  const mockItisService: any = {};

  describe("getCollectionUnitsFromCategoryId", () => {
    const mockResult = [
      {
        collection_unit_id: "1",
        collection_category_id: "1",
        unit_name: "name",
        description: "desc",
        create_user: "1",
        update_user: "1",
        create_timestamp: new Date("1970-01-01"),
        update_timestamp: new Date("1970-01-01"),
      },
    ];
    it("should return collection units", async () => {
      mockRepository.getCollectionUnitsFromCategoryId.mockResolvedValue(
        mockResult
      );
      const xrefService = new XrefService(mockRepository, mockItisService);
      const result =
        await xrefService.getCollectionUnitsFromCategoryId("valid_category_id");
      expect(
        mockRepository.getCollectionUnitsFromCategoryId
      ).toHaveBeenCalledWith("valid_category_id");
      expect(result).toStrictEqual(mockResult);
    });

    it("should return collection units as select format", async () => {
      mockRepository.getCollectionUnitsFromCategoryId.mockResolvedValue(
        mockResult
      );
      const xrefService = new XrefService(mockRepository, mockItisService);
      const result = await xrefService.getCollectionUnitsFromCategoryId(
        "valid_category_id",
        true
      );
      expect(
        mockRepository.getCollectionUnitsFromCategoryId
      ).toHaveBeenCalledWith("valid_category_id");
      expect(result).toStrictEqual([
        { id: "1", key: "collection_unit_id", value: "name" },
      ]);
    });
  });
});
