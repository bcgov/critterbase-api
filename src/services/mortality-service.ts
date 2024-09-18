import type { mortality } from '@prisma/client';
import { MortalityRepository } from '../repositories/mortality-repository';
import { IDetailedCritterMortality } from '../schemas/critter-schema';
import { MortalityCreate, MortalityDetailed, MortalityUpdate } from '../schemas/mortality-schema';
import { prisma } from '../utils/constants';
import { Service } from './base-service';
import { ItisService } from './itis-service';

/**
 * Mortality Service
 *
 * @export
 * @class MortalityService
 * @implements InternalService
 */
export class MortalityService implements Service {
  repository: MortalityRepository;
  itisService: ItisService;

  /**
   * Construct MortalityService class.
   *
   * @param {MortalityRepository} repository - Repository dependency.
   * @param {ItisService} itisService - Itis service dependency.
   */
  constructor(repository: MortalityRepository, itisService: ItisService) {
    this.repository = repository;
    this.itisService = itisService;
  }

  /**
   * Instantiate MortalityService and inject dependencies.
   *
   * @static
   * @returns {MortalityService}
   */
  static init(): MortalityService {
    return new MortalityService(new MortalityRepository(prisma), new ItisService());
  }

  /**
   * Validate `proximate_predated_by_itis_tsn` or `ultimate_predated_by_itis_tsn` are TSN values.
   * ItisService method will throw if unable to find matching TSN value.
   *
   * @async
   * @throws {apiError.notFound} - Failed to find matching ITIS TSN.
   * @param {MortalityUpdate | MortalityCreate} body - Update or create payload (includes predation values).
   * @returns {Promise<void>} - Does not return - only throws when invalid TSN's.
   */
  async throwIfPredationsAreNotTsns(body: MortalityUpdate | MortalityCreate): Promise<void> {
    const promises = [];
    if (body?.proximate_predated_by_itis_tsn) {
      promises.push(this.itisService.searchSolrByTsn(body.proximate_predated_by_itis_tsn));
    }
    if (body?.ultimate_predated_by_itis_tsn) {
      promises.push(this.itisService.searchSolrByTsn(body.ultimate_predated_by_itis_tsn));
    }
    await Promise.all(promises);
  }

  /**
   * Get all mortality records in Critterbase.
   *
   * @async
   * @returns {Promise<mortality[]>} Critter mortality.
   */
  async getAllMortalities(): Promise<mortality[]> {
    return this.repository.getAllMortalities();
  }

  /**
   * Get critter mortality by mortality id.
   *
   * @async
   * @throws {apiError.notFound} - Mortality not found.
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @returns {Promise<MortalityDetailed>} Critter mortality or null.
   */
  async getMortalityById(mortality_id: string): Promise<MortalityDetailed> {
    return this.repository.getMortalityById(mortality_id);
  }

  /**
   * Get the default `cause of death (cod)` id.
   *
   * @async
   * @template T
   * @returns {Promise<string>} Default cause of death id
   */
  async getDefaultCauseOfDeathId(): Promise<string> {
    return this.repository.getDefaultCauseOfDeathId();
  }

  /**
   * Get all mortality records by critter id.
   *
   * @async
   * @param {string} critter_id - Primary identifier of a critter.
   * @returns {Promise<mortality[]>} Critter mortalities.
   */
  async getMortalityByCritter(critter_id: string): Promise<MortalityDetailed[]> {
    return this.repository.getMortalityByCritter(critter_id);
  }

  /**
   * Create a critter mortality.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - Failed to create mortality.
   * @throws {apiError.notFound} - ITIS failed to find matching TSN's for predations.
   * @param {MortalityCreate} mortality_data - Create payload.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async createMortality(mortality_data: MortalityCreate): Promise<mortality> {
    await this.throwIfPredationsAreNotTsns(mortality_data);
    return this.repository.createMortality(mortality_data);
  }

  /**
   * Update a critter mortality.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - Failed to update mortality.
   * @throws {apiError.notFound} - ITIS failed to find matching TSN's for predations.
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @param {MortalityUpdate} mortality_data - Update payload.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async updateMortality(mortality_id: string, mortality_data: MortalityUpdate): Promise<mortality> {
    await this.throwIfPredationsAreNotTsns(mortality_data);
    return this.repository.updateMortality(mortality_id, mortality_data);
  }

  /**
   * Delete a critter mortality and location as a transaction.
   *
   * @async
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async deleteMortality(mortality_id: string): Promise<mortality> {
    return this.repository.deleteMortality(mortality_id);
  }

  /**
   * Find a critter's mortality(s).
   * Business rules allow critters to have multiple mortalities.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterMortality[]>} mortalities.
   */
  async findCritterMortalities(critterId: string): Promise<IDetailedCritterMortality[]> {
    return this.repository.findCritterMortalities(critterId);
  }
}
