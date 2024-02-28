import { defaultFormat } from "../utils/constants";
import { CritterRepository } from "../repositories/critter-repository";
import { InternalService } from "./base-service";
import { QueryFormats } from "../utils/types";
import {
  CritterCreateOptionalItis,
  CritterUpdate,
  SimilarCritterQuery,
} from "../schemas/critter-schema";

/**
 * Critter Service
 * @export
 * @class Critter Service
 * @extends Service<CritterRepository>
 */
export class CritterService extends InternalService<CritterRepository> {
  /**
   * Get all critters.
   *
   * @async
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getAllCritters() {
    return this.repository.getAllCritters();
  }

  /**
   * Get multiple critters by critter ids.
   *
   * @async
   * @param {string[]} critterIds - array of critter ids.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getMultipleCrittersByIds(critterIds: string[]) {
    return this.repository.getMultipleCrittersByIds(critterIds);
  }

  /**
   * Get critter by critter id.
   *
   * @async
   * @param {string} critterId - critter id.
   * @param {QueryFormats} format - additional response format (supports detailed).
   * @returns {Promise<ICritter | ICritterDetailed>} critter object.
   */
  async getCritterById(critterId: string, format = defaultFormat) {
    if (format === QueryFormats.detailed) {
      const critter = await this.repository.getCritterById(critterId);
      const markings = await this.repository.findCritterMarkings(critterId);
      const captures = await this.repository.findCritterCaptures(critterId);
      const qualitative =
        await this.repository.findCritterQualitativeMeasurements(critterId);
      const quantitative =
        await this.repository.findCritterQuantitativeMeasurements(critterId);
      const collection_units =
        await this.repository.findCritterCollectionUnits(critterId);
      const mortality = await this.repository.findCritterMortalities(critterId);
      const family_parent = await this.repository.findCritterParents(critterId);
      const family_child = await this.repository.findCritterChildren(critterId);

      return {
        ...critter,
        markings,
        captures,
        collection_units,
        measurements: { qualitative, quantitative },
        mortality,
        family_parent,
        family_child,
      };
    }
    return this.repository.getCritterById(critterId);
  }

  /**
   * Get critter by WLH id.
   * Note: It might seem weird to return array of critters, but it's known that
   * WLH id is not able to guarantee uniqueness.
   *
   * @async
   * @param {string} wlhId - wildlife health id.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getCrittersByWlhId(wlhId: string) {
    return this.repository.getCrittersByWlhId(wlhId);
  }

  /**
   * Get all critters or critters with matching WLH id.
   *
   * @async
   * @param {string} [wlhId] - wildlife health id.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getAllCrittersOrCrittersWithWlhId(wlhId?: string) {
    if (wlhId) {
      return this.repository.getCrittersByWlhId(wlhId);
    }
    return this.repository.getAllCritters();
  }

  /**
   * Update existing critter.
   *
   * @async
   * @param {string} critterId - critter id.
   * @param {CritterUpdate} critterData - critter update payload.
   * @returns {Promise<ICritter>} critter object.
   */
  async updateCritter(critterId: string, critterData: CritterUpdate) {
    const itisPatchedCritter =
      await this.itisService.patchTsnAndScientificName(critterData);

    return this.repository.updateCritter(critterId, itisPatchedCritter);
  }

  /**
   * Create a critter.
   * Patches itis_tsn + itis_scientific_name with ITIS values.
   *
   * @async
   * @param {CritterCreateOptionalItis} critterData - create critter payload with optional itis fields.
   * @throws {apiError.notFound} - when invalid tsn.
   * @returns {Promise<ICritter>} critter object.
   */
  async createCritter(critterData: CritterCreateOptionalItis) {
    const itisPatchedCritter =
      await this.itisService.patchTsnAndScientificName(critterData);

    return this.repository.createCritter(itisPatchedCritter);
  }

  /**
   * Find similar critters from common semi-unique attributes, including markings.
   *
   * @async
   * @param {SimilarCritterQuery} critterQuery - attributes to query.
   * @returns {Promise<ICritter[]>} array of critters.
   */
  async findSimilarCritters(critterQuery: SimilarCritterQuery) {
    return this.repository.findSimilarCritters(critterQuery);
  }
}
