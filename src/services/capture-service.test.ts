import { CaptureRepository } from '../repositories/capture-repository';
import { CaptureService } from './capture-service';
describe('capture-service', () => {
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = {
      getCaptureById: jest.fn(),
      findCritterCaptures: jest.fn(),
      createCapture: jest.fn(),
      updateCapture: jest.fn(),
      deleteCapture: jest.fn(),
      deleteMultipleCaptures: jest.fn()
    };
  });

  describe('constructor', () => {
    it('should instantiate MarkingService with all dependencies', () => {
      const repoMock: any = jest.fn();
      const markingService = new CaptureService(repoMock);
      expect(markingService.repository).toBe(repoMock);
    });
  });

  describe('init', () => {
    it('should instatitate MarkingService with dependencies', () => {
      const markingService = CaptureService.init();
      expect(markingService).toBeInstanceOf(CaptureService);
      expect(markingService.repository).toBeInstanceOf(CaptureRepository);
    });
  });

  describe('getCaptureById', () => {
    it('should pass correct values to repo method', () => {
      const captureService = new CaptureService(repositoryMock);
      captureService.getCaptureById('A');

      expect(repositoryMock.getCaptureById).toHaveBeenCalledWith('A');
    });
  });

  describe('findCritterCaptures', () => {
    it('should pass correct values to repo method', () => {
      const captureService = new CaptureService(repositoryMock);
      captureService.findCritterCaptures('A');

      expect(repositoryMock.findCritterCaptures).toHaveBeenCalledWith('A');
    });
  });

  describe('createCapture', () => {
    it('should pass correct values to repo method', () => {
      const captureService = new CaptureService(repositoryMock);
      const payload = { critter_id: 'A', capture_date: new Date('2024-01-01') };
      captureService.createCapture(payload);

      expect(repositoryMock.createCapture).toHaveBeenCalledWith(payload);
    });
  });

  describe('updateCapture', () => {
    it('should pass correct values to repo method', () => {
      const captureService = new CaptureService(repositoryMock);
      const payload = { critter_id: 'A', capture_date: new Date('2024-01-01') };
      captureService.updateCapture('A', payload);

      expect(repositoryMock.updateCapture).toHaveBeenCalledWith('A', payload);
    });
  });

  describe('deleteCapture', () => {
    it('should pass correct values to repo method', () => {
      const captureService = new CaptureService(repositoryMock);
      captureService.deleteCapture('A');

      expect(repositoryMock.deleteCapture).toHaveBeenCalledWith('A');
    });
  });

  describe('deleteMultipleCapture', () => {
    it('should pass correct values to repo method', () => {
      const captureService = new CaptureService(repositoryMock);
      captureService.deleteMultipleCaptures(['A']);

      expect(repositoryMock.deleteMultipleCaptures).toHaveBeenCalledWith(['A']);
    });
  });
});
