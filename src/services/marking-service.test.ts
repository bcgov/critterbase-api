import { MarkingRepository } from '../repositories/marking-repository';
import { ItisService } from './itis-service';
import { MarkingService } from './marking-service';

describe('marking-service', () => {
  let repositoryMock;
  let itisServiceMock;

  describe('constructor', () => {
    it('should instantiate MarkingService with all dependencies', () => {
      const repoMock: any = jest.fn();
      const itisMock: any = jest.fn();
      const markingService = new MarkingService(repoMock, itisMock);
      expect(markingService.repository).toBe(repoMock);
      expect(markingService.itisService).toBe(itisMock);
    });
  });

  describe('init', () => {
    it('should instatitate MarkingService with dependencies', () => {
      const markingService = MarkingService.init();
      expect(markingService).toBeInstanceOf(MarkingService);
      expect(markingService.repository).toBeInstanceOf(MarkingRepository);
      expect(markingService.itisService).toBeInstanceOf(ItisService);
    });
  });

  describe('verifyMarkingsCanBeAssignedToTsn', () => {
    beforeEach(() => {
      repositoryMock = {
        findInvalidMarkingIdsFromTsnHierarchy: jest.fn()
      };
      itisServiceMock = {
        getTsnHierarchy: jest.fn()
      };
    });

    const bodyMock = {
      itis_tsn: 0,
      markings: [{ marking_id: 1 }, { marking_id: 2 }]
    };

    it('should pass correct values to itis and repo methods', async () => {
      itisServiceMock.getTsnHierarchy.mockResolvedValue([3, 4]);
      repositoryMock.findInvalidMarkingIdsFromTsnHierarchy.mockResolvedValue([{ marking_id: 1 }]);

      const markingService = new MarkingService(repositoryMock, itisServiceMock);

      const result = await markingService.verifyMarkingsCanBeAssignedToTsn(bodyMock as any);

      expect(itisServiceMock.getTsnHierarchy).toHaveBeenCalledWith(bodyMock.itis_tsn);
      expect(repositoryMock.findInvalidMarkingIdsFromTsnHierarchy).toHaveBeenCalledWith([1, 2], [3, 4]);

      expect(result.verified).toBeFalsy();
      expect(result.invalid_markings).toStrictEqual([{ marking_id: 1 }]);
    });

    it('should return no invalid markings and verified true when all markings pass', async () => {
      itisServiceMock.getTsnHierarchy.mockResolvedValue([3, 4]);
      repositoryMock.findInvalidMarkingIdsFromTsnHierarchy.mockResolvedValue([]);

      const markingService = new MarkingService(repositoryMock, itisServiceMock);

      const result = await markingService.verifyMarkingsCanBeAssignedToTsn(bodyMock as any);

      expect(itisServiceMock.getTsnHierarchy).toHaveBeenCalledWith(bodyMock.itis_tsn);
      expect(repositoryMock.findInvalidMarkingIdsFromTsnHierarchy).toHaveBeenCalledWith([1, 2], [3, 4]);

      expect(result.verified).toBeTruthy();
      expect(result.invalid_markings).toStrictEqual([]);
    });
  });
});
