import { MarkingVerificationType } from "../api/marking/marking.utils";
import { MarkingRepository } from "../repositories/marking-repository";
import { InternalService } from "./base-service";

export class MarkingService extends InternalService<MarkingRepository> {
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

    const invalidMarkingIds =
      await this.repository.findInvalidMarkingIdsFromTsnHierarchy(
        markingIds,
        tsnHierarchy
      );

    const allVerified = invalidMarkingIds.length === 0;

    return {
      verified: allVerified,
      invalid_markings: invalidMarkingIds,
    };
  }
}
