import {
  CritterUpdate,
  ICritter,
  CritterCreateRequiredItis,
} from "../schemas/critter-schema";
import { apiError } from "../utils/types";
import { Repository } from "./base-repository";

/**
 * Critter Service
 *
 * @export
 * @class CritterService
 * @extends Repository
 */
export class CritterRepository extends Repository {
  /**
   * Default critter properties, omitting audit columns.
   *
   */
  private critterProperties = {
    critter_id: true,
    itis_tsn: true,
    itis_scientific_name: true,
    animal_id: true,
    sex: true,
    wlh_id: true,
    responsible_region_nr_id: true,
    critter_comment: true,
  };

  /**
   * Get all critters.
   *
   * @async
   * @throws {apiError.notFound} - if query returns no critters.
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getAllCritters(): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.notFound(`Failed to find critters.`, [
        "CritterRepository -> getAllCritters",
        "results had a length of 0",
      ]);
    }

    return result;
  }

  /**
   * Get multiple critters by critter ids.
   *
   * @async
   * @param {string[]} critter_ids - array of critter ids.
   * @throws {apiError.notFound} - if query returns no critters.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getMultipleCrittersByIds(critter_ids: string[]): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      where: { critter_id: { in: critter_ids } },
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.notFound(`Failed to find critters.`, [
        `CritterRepository -> getMultipleCrittersByIds`,
        "results had a length of 0",
      ]);
    }

    return result;
  }

  /**
   * Get critter by critter id.
   *
   * @async
   * @param {string} critterId - critter id.
   * @throws {apiError.notFound} - if query returns no critter.
   * @returns {Promise<ICritter[]>} critter object.
   */
  async getCritterById(critterId: string): Promise<ICritter> {
    const result = await this.prisma.critter.findUnique({
      where: { critter_id: critterId },
      select: this.critterProperties,
    });

    if (!result) {
      throw apiError.notFound(`Failed to find specific critter.`, [
        "CritterRepository -> getCritterById",
        "result was undefined",
      ]);
    }

    return result;
  }

  /**
   * Get critter by WLH id.
   * Note: It might seem weird to return array of critters, but it's known that
   * WLH id is not able to guarantee uniqueness.
   *
   * @async
   * @param {string} wlhId - wildlife health id.
   * @throws {apiError.sqlExecuteIssue} - if query returns no critter.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getCrittersByWlhId(wlhId: string) {
    const result = await this.prisma.critter.findMany({
      where: { wlh_id: wlhId },
      select: this.critterProperties,
    });

    if (!result.length) {
      throw apiError.notFound(
        `Failed to find critters with wlh-id: ${wlhId}.`,
        ["CritterRepository -> getCritterByWlhId", "results had a length of 0"],
      );
    }

    return result;
  }

  /**
   * Update existing critter.
   *
   * @async
   * @param {string} critterId - critter id.
   * @param {CritterUpdate} critterData - critter update payload.
   * @throws {apiError.sqlExecuteIssue} - if query was unable to update critter.
   * @returns {Promise<ICritter>} critter object.
   */
  async updateCritter(
    critterId: string,
    critterData: CritterUpdate,
  ): Promise<ICritter> {
    try {
      const result = await this.prisma.critter.update({
        where: {
          critter_id: critterId,
        },
        data: critterData,
        select: this.critterProperties,
      });

      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to update critter.`, [
        "CritterRepository -> updateCritter",
        "prisma threw error",
        err,
      ]);
    }
  }

  /**
   * Create a critter.
   *
   * @async
   * @param {CritterCreateRequriedItis} critterData - critter create payload with required itis fields.
   * @throws {apiError.sqlExecuteIssue} - if query was unable to create critter.
   * @returns {Promise<ICritter>} critter object.
   */
  async createCritter(
    critterData: CritterCreateRequiredItis,
  ): Promise<ICritter> {
    try {
      const result = await this.prisma.critter.create({
        data: critterData,
        select: this.critterProperties,
      });

      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to create critter.`, [
        "CritterRepository -> createCritter",
        "prisma threw error",
        err,
      ]);
    }
  }

  // TODO: Move these repository methods to individual repositories once built.
  // ie: CritterRepository.getCritterMarkings -> MarkingRepository.getCritterMarkings
  async getCritterMarkings(critterId: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT
          m.marking_id,
          m.capture_id,
          m.mortality_id,
          b.body_location,
          t.name as marking_type,
          mt.material,
          c1.colour as primary_colour,
          c2.colour as secondary_colour,
          c3.colour as text_colour,
          m.identifier,
          m.frequency_unit,
          m.order,
          m.removed_timestamp
        FROM marking m
        LEFT JOIN xref_taxon_marking_body_location b
          ON m.taxon_marking_body_location_id = b.taxon_marking_body_location_id
        LEFT JOIN lk_marking_type t
          ON t.marking_type_id = m.marking_type_id
        LEFT JOIN lk_marking_material mt
          ON mt.marking_material_id = m.marking_material_id
        LEFT JOIN lk_colour c1
          ON c1.colour_id = m.primary_colour_id
        LEFT JOIN lk_colour c2
          ON c2.colour_id = m.secondary_colour_id
        LEFT JOIN lk_colour c3
          ON c3.colour_id = m.text_colour_id
        WHERE m.critter_id = ${critterId}::uuid`;

      return result;
    } catch (err) {
      console.log(
        "Failed to execute raw sql query. CritterService -> getCritterMarkings",
        { error: err },
      );
      return [];
    }
  }

  async getCritterCaptures(critterId: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT
          c.capture_id,
          c.capture_timestamp,
          c.release_timestamp,
          json_agg(cl) as capture_location,
          json_agg(rl) as release_location,
          c.capture_comment,
          c.release_comment
        FROM capture c
        LEFT JOIN (
          SELECT
            location_id, latitude, longitude, coordinate_uncertainty_unit,
            elevation, temperature, location_comment
          FROM location
        ) as cl
          ON cl.location_id = c.capture_location_id
        LEFT JOIN (
          SELECT
            location_id, latitude, longitude, coordinate_uncertainty_unit,
            elevation, temperature, location_comment
          FROM location
        ) as rl
          ON rl.location_id = c.release_location_id
        WHERE c.critter_id = ${critterId}::uuid
        GROUP BY c.capture_id;`;

      return result;
    } catch (err) {
      console.log(
        "Failed to execute raw sql query. CritterService -> getCritterCaptures",
        { error: err },
      );
      return [];
    }
  }

  async getCritterMortalities(critterId: string) {
    const result = await this.prisma.mortality.findMany({
      where: { critter_id: critterId },
    });

    return result;
  }

  async getCritterQualitativeMeasurements(critterId: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT
          m.capture_id,
          m.mortality_id,
          x.measurement_name,
          o.option_label as value,
          m.measurement_comment,
          m.measured_timestamp
        FROM measurement_qualitative m
        LEFT JOIN xref_taxon_measurement_qualitative x
          ON x.taxon_measurement_id = m.taxon_measurement_id
        LEFT JOIN xref_taxon_measurement_qualitative_option o
          ON o.qualitative_option_id = m.qualitative_option_id
        WHERE m.critter_id = ${critterId}::uuid;`;

      return result;
    } catch (err) {
      console.log(
        "Failed to execute raw sql query. CritterService -> getCritterQualitativeMeasurements",
        { error: err },
      );
      return [];
    }
  }

  /**
   * Get recorded 'quantitative measurements' of a critter.
   *
   * @async
   * @param {string} critterId - [TODO:description]
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getCritterQuantitativeMeasurements(critterId: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT
          m.capture_id,
          m.mortality_id,
          m.taxon_measurement_id,
          x.measurement_name,
          m.value,
          m.measurement_comment,
          m.measured_timestamp
        FROM measurement_quantitative m
        LEFT JOIN xref_taxon_measurement_quantitative x
          ON x.taxon_measurement_id = m.taxon_measurement_id
        WHERE m.critter_id = ${critterId}::uuid;`;

      return result;
    } catch (err) {
      console.log(
        "Failed to execute raw sql query. CritterService -> getCritterQuantitativeMeasurements",
        { error: err },
      );
      return [];
    }
  }

  /**
   * Get recorded 'collection units' of a critter.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getCritterCollectionUnits(critterId: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT
          c.critter_collection_unit_id,
          x.unit_name,
          l.category_name
        FROM critter_collection_unit c
        LEFT JOIN xref_collection_unit x
          ON x.collection_unit_id = c.collection_unit_id
        LEFT JOIN lk_collection_category l
          ON l.collection_category_id = x.collection_category_id
        WHERE c.critter_id = ${critterId}::uuid;`;

      return result;
    } catch (err) {
      console.log(
        "Failed to execute raw sql query. CritterService -> getCritterCollectionUnits",
        { error: err },
      );
      return [];
    }
  }
}
