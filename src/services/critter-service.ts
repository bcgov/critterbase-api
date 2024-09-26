import { DBClient, DBTxClient } from '../client/client';
import { CritterRepository } from '../repositories/critter-repository';
import {
  CritterCreateOptionalItis,
  CritterUpdate,
  ICritterForView,
  IDetailedCritter,
  IDetailedManyCritter,
  SimilarCritterQuery
} from '../schemas/critter-schema';
import { CaptureMortalityGeometry } from '../schemas/spatial-schema';
import { defaultFormat } from '../utils/constants';
import { QueryFormats } from '../utils/types';
import { Service } from './base-service';
import { CaptureService } from './capture-service';
import { ItisService } from './itis-service';
import { MarkingService } from './marking-service';
import { MortalityService } from './mortality-service';

type CritterAttributeServices = {
  itisService: ItisService;
  mortalityService: MortalityService;
  markingService: MarkingService;
  captureService: CaptureService;
};

/**
 * Critter Service
 *
 * @export
 * @class CritterService
 * @implements InternalService
 */
export class CritterService implements Service {
  repository: CritterRepository;
  /**
   * Service Dependencies
   */
  itisService: ItisService;
  mortalityService: MortalityService;
  markingService: MarkingService;
  captureService: CaptureService;

  /**
   * Construct CritterService class.
   *
   * @param {CritterRepository} repository - Critter repository dependency.
   */
  constructor(repository: CritterRepository, services: CritterAttributeServices) {
    this.repository = repository;

    this.itisService = services.itisService;
    this.mortalityService = services.mortalityService;
    this.markingService = services.markingService;
    this.captureService = services.captureService;
  }

  /**
   * Instantiate CritterService and inject dependencies.
   *
   * @static
   * @param {DBTxClient | DBClient} client - Database client
   * @returns {CritterService}
   */
  static init(client: DBTxClient | DBClient): CritterService {
    return new CritterService(new CritterRepository(client), {
      itisService: new ItisService(),
      mortalityService: MortalityService.init(client),
      markingService: MarkingService.init(client),
      captureService: CaptureService.init(client)
      // TODO: fill in missing services once refactor finalized
    });
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
   * Get multiple critters by critter ids (default or detailed format)
   *
   * @async
   * @param {string[]} critterIds - array of critter ids.
   * @returns {Promise<ICritterForView[] | IDetailedManyCritter[]>} default or detailed critter objects.
   */
  async getMultipleCrittersByIds(
    critterIds: string[],
    format = defaultFormat
  ): Promise<ICritterForView[] | IDetailedManyCritter[]> {
    if (format === QueryFormats.detailed) {
      return this.repository.getMultipleCrittersByIdsDetailed(critterIds);
    }
    return this.repository.getMultipleCrittersByIds(critterIds);
  }

  /**
   * Get capture and mortality geometry for multiple critter IDs
   *
   * @async
   * @param {string[]} critterIds - array of critter ids.
   * @returns {Promise<ICritter[] | IDetailedManyCritter[]>} default or detailed critter objects.
   */
  async getMultipleCrittersGeometryByIds(critterIds: string[]): Promise<CaptureMortalityGeometry> {
    return this.repository.getMultipleCrittersGeometryByIds(critterIds);
  }

  /**
   * Get critter by critter id as `detailed` format.
   * Includes additional critter meta.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritter>} detailed critter
   */
  async getCritterByIdDetailed(critterId: string): Promise<IDetailedCritter> {
    const [
      critter,
      markings,
      captures,
      qualitative,
      quantitative,
      collection_units,
      mortality,
      family_parent,
      family_child
    ] = await Promise.all([
      this.repository.getCritterById(critterId),
      this.markingService.findCritterMarkings(critterId),
      this.captureService.findCritterCaptures(critterId),
      this.repository.findCritterQualitativeMeasurements(critterId),
      this.repository.findCritterQuantitativeMeasurements(critterId),
      this.repository.findCritterCollectionUnits(critterId),
      this.mortalityService.findCritterMortalities(critterId),
      this.repository.findCritterParents(critterId),
      this.repository.findCritterChildren(critterId)
    ]);

    return {
      ...critter,
      markings,
      captures,
      collection_units,
      measurements: { qualitative, quantitative },
      mortality,
      family_parent,
      family_child
    };
  }

  /**
   * Get critter by critter id.
   *
   * @async
   * @param {string} critterId - critter id.
   * @param {QueryFormats} format - additional response format (supports detailed).
   * @returns {Promise<ICritterForView | IDetailedCritter>} default or detailed critter object.
   */
  async getCritterById(critterId: string, format = defaultFormat): Promise<ICritterForView | IDetailedCritter> {
    if (format === QueryFormats.detailed) {
      return this.getCritterByIdDetailed(critterId);
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
    const itisPatchedCritter = await this.itisService.patchTsnAndScientificName(critterData);

    return this.repository.updateCritter(critterId, itisPatchedCritter);
  }

  /**
   * Create a critter.
   * Patches itis_tsn + itis_scientific_name with ITIS values.
   *
   * @async
   * @throws {apiError.notFound} - when invalid tsn.
   * @param {CritterCreateOptionalItis} critterData - create critter payload with optional itis fields.
   * @returns {Promise<ICritter>} critter object.
   */
  async createCritter(critterData: CritterCreateOptionalItis) {
    const itisPatchedCritter = await this.itisService.patchTsnAndScientificName(critterData);

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
