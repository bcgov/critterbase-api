import { Prisma } from "@prisma/client";
import {
  CritterUpdate,
  ICritter,
  CritterCreateRequiredItis,
  SimilarCritterQuery,
  IDetailedCritterMarking,
  DetailedCritterMarkingSchema,
  CritterSchema,
  DetailedCritterMortalitySchema,
  IDetailedCritterMortality,
  DetailedCritterQualitativeMeasurementSchema,
  IDetailedCritterQualitativeMeasurement,
  DetailedCritterQuantitativeMeasurementSchema,
  IDetailedCritterQuantitativeMeasurement,
  DetailedCritterCollectionUnit,
  IDetailedCritterCollectionUnit,
  DetailedCritterCaptureSchema,
  IDetailedCritterCapture,
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
  private _critterProperties = {
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
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getAllCritters(): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      select: this._critterProperties,
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
      select: this._critterProperties,
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
   * @returns {Promise<ICritter>} critter object.
   */
  async getCritterById(critterId: string): Promise<ICritter> {
    const result = await this.prisma.critter.findUnique({
      where: { critter_id: critterId },
      select: this._critterProperties,
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
  async getCrittersByWlhId(wlhId: string): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      where: { wlh_id: wlhId },
      select: this._critterProperties,
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
        select: this._critterProperties,
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
        select: this._critterProperties,
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

  /**
   * Find critters by semi-unique attributes, including markings.
   *
   * Matches on:
   *  wlh id
   *  animal id (critter alias)
   *  marking colour + marking body location + marking type
   *  marking type + marking identifier
   *
   * @async
   * @param {SimilarCritterQuery} query - critter query.
   * @returns {Promise<ICritter[]>} critters.
   */
  async findSimilarCritters(query: SimilarCritterQuery): Promise<ICritter[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.critter_id,
          c.itis_tsn,
          c.itis_scientific_name,
          c.wlh_id,
          c.animal_id,
          c.sex,
          c.responsible_region_nr_id,
          c.critter_comment
        FROM critter c
        LEFT JOIN marking m
          ON m.critter_id = c.critter_id
        JOIN lk_colour pc
          ON pc.colour_id = m.primary_colour_id
        JOIN xref_taxon_marking_body_location x
          ON x.taxon_marking_body_location_id = m.taxon_marking_body_location_id
        JOIN lk_marking_type t
          ON t.marking_type_id = m.marking_type_id
        WHERE
          c.wlh_id = ${query.critter?.wlh_id}
        OR
          c.animal_id ILIKE ${query.critter?.animal_id}
        OR
          (pc.colour ILIKE ${query.marking?.primary_colour}
          AND x.body_location ILIKE ${query.marking?.body_location}
          AND t.name ILIKE ${query.marking?.marking_type})
        OR
          (t.name ILIKE ${query.marking?.marking_type}
          AND m.identifier ILIKE ${query.marking?.identifier});`,
      CritterSchema.array(),
    );

    return result;
  }
  /**
   * TODO: Move these repository methods to individual repositories once built.
   * ie: CritterRepository.getCritterMarkings -> MarkingRepository.getCritterMarkings
   */

  /**
   * Find a critter's markings.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterMarking[]>} markings.
   */
  async findCritterMarkings(
    critterId: string,
  ): Promise<IDetailedCritterMarking[]> {
    const result = await this.safeQuery(
      Prisma.sql`
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
          m.frequency,
          m.frequency_unit,
          m.order,
          m.attached_timestamp,
          m.removed_timestamp,
          m.comment
        FROM marking m
        JOIN xref_taxon_marking_body_location b
          ON m.taxon_marking_body_location_id = b.taxon_marking_body_location_id
        JOIN lk_marking_type t
          ON t.marking_type_id = m.marking_type_id
        JOIN lk_marking_material mt
          ON mt.marking_material_id = m.marking_material_id
        JOIN lk_colour c1
          ON c1.colour_id = m.primary_colour_id
        JOIN lk_colour c2
          ON c2.colour_id = m.secondary_colour_id
        JOIN lk_colour c3
          ON c3.colour_id = m.text_colour_id
        WHERE m.critter_id = ${critterId}::uuid
        `,
      DetailedCritterMarkingSchema.array(),
    );

    return result;
  }

  /**
   * Find a critter's captures.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterCapture[]>} captures.
   */
  async findCritterCaptures(
    critterId: string,
  ): Promise<IDetailedCritterCapture[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.capture_id,
          c.capture_timestamp,
          c.release_timestamp,
          row_to_json(cl) as capture_location,
          row_to_json(rl) as release_location,
          c.capture_comment,
          c.release_comment
        FROM capture c
        JOIN (
          SELECT
            location_id, latitude, longitude, coordinate_uncertainty,
            coordinate_uncertainty_unit, elevation, temperature, location_comment
          FROM location
        ) as cl
          ON cl.location_id = c.capture_location_id
        JOIN (
          SELECT
            location_id, latitude, longitude, coordinate_uncertainty,
            coordinate_uncertainty_unit, elevation, temperature, location_comment
          FROM location
        ) as rl
          ON rl.location_id = c.release_location_id
        WHERE c.critter_id = ${critterId}::uuid
        GROUP BY c.capture_id, cl.*, rl.*;`,
      DetailedCritterCaptureSchema.array(),
    );

    return result;
  }

  /**
   * Find a critter's mortality(s).
   * Business rules allow critters to have multiple mortalities.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterMortality[]>} mortalities.
   */
  async findCritterMortalities(
    critterId: string,
  ): Promise<IDetailedCritterMortality[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.mortality_id,
          m.mortality_timestamp,
          row_to_json(ml) as mortality_location,
          pd.cod_category as proximate_cause_of_death_category,
          pd.cod_reason as proximate_cause_of_death_reason,
          m.proximate_cause_of_death_confidence,
          ud.cod_category as ultimate_cause_of_death_category,
          ud.cod_reason as ultimate_cause_of_death_reason,
          m.ultimate_cause_of_death_confidence,
          m.mortality_comment,
          m.proximate_predated_by_itis_tsn,
          m.ultimate_predated_by_itis_tsn
        FROM mortality m
        JOIN (
          SELECT
            location_id, latitude, longitude, coordinate_uncertainty,
            coordinate_uncertainty_unit, elevation, temperature, location_comment
          FROM location
        ) as ml
          ON ml.location_id = m.location_id
        LEFT JOIN lk_cause_of_death pd
          ON m.proximate_cause_of_death_id = pd.cod_id
        LEFT JOIN lk_cause_of_death ud
          ON m.proximate_cause_of_death_id = ud.cod_id
        WHERE m.critter_id = ${critterId}::uuid
        GROUP BY m.mortality_id, pd.cod_category, ud.cod_category, pd.cod_reason, ud.cod_reason, ml.*;`,
      DetailedCritterMortalitySchema.array(),
    );

    return result;
  }

  /**
   * Find a critter's qualitative measurements.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterQualitativeMeasurement>} qualitative measurements.
   */
  async findCritterQualitativeMeasurements(
    critterId: string,
  ): Promise<IDetailedCritterQualitativeMeasurement[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.measurement_qualitative_id,
          m.taxon_measurement_id,
          m.capture_id,
          m.mortality_id,
          x.measurement_name,
          o.option_label as value,
          m.measurement_comment,
          m.measured_timestamp
        FROM measurement_qualitative m
        JOIN xref_taxon_measurement_qualitative x
          ON x.taxon_measurement_id = m.taxon_measurement_id
        JOIN xref_taxon_measurement_qualitative_option o
          ON o.qualitative_option_id = m.qualitative_option_id
        WHERE m.critter_id = ${critterId}::uuid;`,
      DetailedCritterQualitativeMeasurementSchema.array(),
    );

    return result;
  }

  /**
   * Find a critter's quantitative measurements.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterQuantitativeMeasurement[]>} quantitative measurements.
   */
  async findCritterQuantitativeMeasurements(
    critterId: string,
  ): Promise<IDetailedCritterQuantitativeMeasurement[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.measurement_quantitative_id,
          m.taxon_measurement_id,
          m.capture_id,
          m.mortality_id,
          m.taxon_measurement_id,
          x.measurement_name,
          m.value,
          m.measurement_comment,
          m.measured_timestamp
        FROM measurement_quantitative m
        JOIN xref_taxon_measurement_quantitative x
          ON x.taxon_measurement_id = m.taxon_measurement_id
        WHERE m.critter_id = ${critterId}::uuid;`,
      DetailedCritterQuantitativeMeasurementSchema.array(),
    );

    return result;
  }

  /**
   * Find a critter's collection units.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterCollectionUnit[]>} collection units.
   */
  async findCritterCollectionUnits(
    critterId: string,
  ): Promise<IDetailedCritterCollectionUnit[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.critter_collection_unit_id,
          x.unit_name,
          l.category_name
        FROM critter_collection_unit c
        JOIN xref_collection_unit x
          ON x.collection_unit_id = c.collection_unit_id
        JOIN lk_collection_category l
          ON l.collection_category_id = x.collection_category_id
        WHERE c.critter_id = ${critterId}::uuid;`,
      DetailedCritterCollectionUnit.array(),
    );

    return result;
  }

  async findCriterFamilies(critterId) {}
}
