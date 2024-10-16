import { MarkingVerificationType } from '../api/marking/marking.utils';
import { DBClient, DBTxClient } from '../client/client';
import { MarkingRepository } from '../repositories/marking-repository';
import { IDetailedCritterMarking } from '../schemas/critter-schema';
import { Service } from './base-service';
import { ItisService } from './itis-service';

/**
 * Marking Service
 *
 * @export
 * @class MarkingService
 * @implements Service
 */
export class MarkingService implements Service {
  repository: MarkingRepository;
  itisService: ItisService;

  /**
   * Construct MarkingService class.
   *
   * @param {MarkingRepository} repository - Repository dependency.
   * @param {ItisService} itisService - Itis service dependency.
   */
  constructor(repository: MarkingRepository, itisService: ItisService) {
    this.repository = repository;
    this.itisService = itisService;
  }

  /**
   * Instantiate MarkingService and inject dependencies.
   *
   * @static
   * @returns {MarkingService}
   */
  static init(client: DBClient | DBTxClient): MarkingService {
    return new MarkingService(new MarkingRepository(client), new ItisService());
  }

  /**
   * Verify whether the supplied markings can be assigned to specific TSN (taxon).
   *
   * @async
   * @param {MarkingVerificationType} body - itis_tsn && array of markings.
   * @returns {Promise<{verified: boolean, invalid_markings: string[]}>} indicator if all verified, and array of problematic marking ids.
   */
  async verifyMarkingsCanBeAssignedToTsn(body: MarkingVerificationType) {
    const tsnHierarchy = await this.itisService.getTsnHierarchy(body.itis_tsn);

    const markingIds = body.markings.map((marking) => marking.marking_id);

    const invalidMarkingIds = await this.repository.findInvalidMarkingIdsFromTsnHierarchy(markingIds, tsnHierarchy);

    const allVerified = invalidMarkingIds.length === 0;

    return {
      verified: allVerified,
      invalid_markings: invalidMarkingIds
    };
  }

  /**
   * Find a critter's markings.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterMarking[]>} markings.
   */
  async findCritterMarkings(critterId: string): Promise<IDetailedCritterMarking[]> {
    return this.repository.findCritterMarkings(critterId);
  }
}
