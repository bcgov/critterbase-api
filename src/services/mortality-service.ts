import type { mortality } from '@prisma/client';
import { MortalityRepository } from '../repositories/mortality-repository';
import { Service } from './base-service';
import { MortalityCreate, MortalityDetailed, MortalityUpdate } from '../schemas/mortality-schema';
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
    return new MortalityService(new MortalityRepository(), new ItisService());
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
   * @returns {Promise<mortality | null>} Critter mortality or null.
   */
  async getMortalityById(mortality_id: string): Promise<MortalityDetailed> {
    return this.repository.getMortalityById(mortality_id);
  }

  /**
   * Append the default cause of death (`Unknown`) id to the body
   * if `proximate_cause_of_death_id` not provided.
   *
   * @async
   * @template T
   * @param {T} body - Object containing `proximate_cause_of_death_id`.
   * @returns {Promise<T>} Body object.
   */
  async appendDefaultCOD<T extends { proximate_cause_of_death_id?: string }>(body: T): Promise<T> {
    return this.repository.appendDefaultCOD(body);
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
   * @param {MortalityCreate} mortality_data - Create payload.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async createMortality(mortality_data: MortalityCreate): Promise<mortality> {
    return this.repository.createMortality(mortality_data);
  }

  /**
   * Update a critter mortality.
   *
   * @async
   * @throws {apiError.sqlExecuteIssue} - Failed to update mortality.
   * @param {string} mortality_id - Primary identifier of a mortality.
   * @param {MortalityUpdate} mortality_data - Update payload.
   * @returns {Promise<mortality>} Critter mortality.
   */
  async updateMortality(mortality_id: string, mortality_data: MortalityUpdate): Promise<mortality> {
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
}
