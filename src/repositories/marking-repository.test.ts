import { MarkingRepository } from "./marking-repository";

describe("marking-repository", () => {
  let mockPrismaClient;
  beforeEach(() => {
    mockPrismaClient = {
      $queryRaw: jest.fn(),
    };
  });
  it("returns array of marking ids", async () => {
    const mockResponse = [{ marking_id: 1 }, { marking_id: 2 }];
    mockPrismaClient.$queryRaw.mockResolvedValue(mockResponse);
    const repo = new MarkingRepository(mockPrismaClient);

    const result = await repo.findInvalidMarkingIdsFromTsnHierarchy(
      ["my-uuid"],
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});
