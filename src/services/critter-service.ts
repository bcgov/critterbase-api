import { defaultFormat } from "../utils/constants";
import { CritterRepository } from "../repositories/critter-repository";
import { InternalService } from "./base-service";
import { QueryFormats } from "../utils/types";
import {
  CritterCreateOptionalItis,
  CritterUpdate,
  SimilarCritterQuery,
} from "../schemas/critter-schema";
import { ItisService } from "./itis-service";

interface ICritterServiceFactory {
  itisService: ItisService;
}

/**
 * Critter Service
 * @export
 * @class Critter Service
 * @extends Service<CritterRepository>
 */
export class CritterService extends InternalService<CritterRepository> {
  serviceFactory: ICritterServiceFactory;

  constructor(
    repository: CritterRepository,
    serviceFactory: ICritterServiceFactory,
  ) {
    super(repository);
    this.serviceFactory = serviceFactory;
  }

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
      const markings = await this.repository.getCritterMarkings(critterId);
      const captures = await this.repository.getCritterCaptures(critterId);
      const qualitative =
        await this.repository.getCritterQualitativeMeasurements(critterId);
      const quantitative =
        await this.repository.getCritterQuantitativeMeasurements(critterId);
      const collection_units =
        await this.repository.getCritterCollectionUnits(critterId);

      return {
        ...critter,
        markings,
        captures,
        collection_units,
        measurements: { qualitative, quantitative },
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
      await this.serviceFactory.itisService.patchTsnAndScientificName(
        critterData,
      );

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
      await this.serviceFactory.itisService.patchTsnAndScientificName(
        critterData,
      );

    return this.repository.createCritter(itisPatchedCritter);
  }

  async findSimilarCritters(critterQuery: SimilarCritterQuery) {
    return this.repository.findSimilarCritters(critterQuery);
  }
}
