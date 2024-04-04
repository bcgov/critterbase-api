import {
  appendDefaultCOD,
  getAllMortalities,
  getMortalityByCritter,
  getMortalityById
} from '../repositories/mortality-repository';
import { ItisService } from './itis-service';
import { MortalityService } from './mortality-service';

describe('mortality-service', () => {
  let repository;
  let itisService: any = jest.fn();

  describe('init', () => {
    const mortalityService = MortalityService.init();
    it('should instantiate MortalityService with all its dependencies', () => {
      expect(mortalityService).toBeInstanceOf(MortalityService);
      expect(mortalityService.repository).toBeDefined();
      expect(mortalityService.itisService).toBeDefined();
    });

    describe('getAllMortalities', () => {
      it('should call correct repository method', async () => {
        repository = { getAllMortalities: jest.fn() };

        const mortalityService = new MortalityService(repository, itisService);
        await mortalityService.getAllMortalities();
        expect(repository.getAllMortalities).toHaveBeenCalled();
      });
    });

    describe('getMortalityById', () => {
      it('should call correct repository method and pass id', async () => {
        repository = { getMortalityById: jest.fn() };

        const mortalityService = new MortalityService(repository, itisService);
        await mortalityService.getMortalityById('a');
        expect(repository.getMortalityById).toHaveBeenCalledWith('a');
      });
    });

    describe('appendDefaultCOD', () => {
      it('should call correct repository method and pass body', async () => {
        repository = { appendDefaultCOD: jest.fn() };

        const mortalityService = new MortalityService(repository, itisService);
        await mortalityService.appendDefaultCOD({ proximate_cause_of_death_id: 'a' });
        expect(repository.appendDefaultCOD).toHaveBeenCalledWith({ proximate_cause_of_death_id: 'a' });
      });
    });

    describe('getMortalityByCritter', () => {
      it('should call correct repository method and pass critter id', async () => {
        repository = { getMortalityByCritter: jest.fn() };

        const mortalityService = new MortalityService(repository, itisService);
        await mortalityService.getMortalityByCritter('a');
        expect(repository.getMortalityByCritter).toHaveBeenCalledWith('a');
      });
    });

    describe('createMortality', () => {
      it('should call correct repository method and pass body', async () => {
        repository = { createMortality: jest.fn() };

        const mortalityService = new MortalityService(repository, itisService);
        await mortalityService.createMortality(true as any);
        expect(repository.createMortality).toHaveBeenCalledWith(true);
      });
    });

    describe('updateMortality', () => {
      it('should call correct repository method and pass update body and id', async () => {
        repository = { updateMortality: jest.fn() };

        const mortalityService = new MortalityService(repository, itisService);
        await mortalityService.updateMortality('id', true as any);
        expect(repository.updateMortality).toHaveBeenCalledWith('id', true);
      });
    });

    describe('deleteMortality', () => {
      it('should call correct repository method and pass update body and id', async () => {
        repository = { deleteMortality: jest.fn() };

        const mortalityService = new MortalityService(repository, itisService);
        await mortalityService.deleteMortality('id');
        expect(repository.deleteMortality).toHaveBeenCalledWith('id');
      });
    });
  });
});
