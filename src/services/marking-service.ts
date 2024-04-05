import { MarkingVerificationType } from '../api/marking/marking.utils';
import { MarkingRepository } from '../repositories/marking-repository';
import { Service } from './base-service';
import { ItisService } from './itis-service';

export class MarkingService implements Service {
  repository: MarkingRepository;
  itisService: ItisService;

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
  static init(): MarkingService {
    return new MarkingService(new MarkingRepository(), new ItisService());
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
}
