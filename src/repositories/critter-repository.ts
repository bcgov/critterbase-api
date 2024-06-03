import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  CritterCreateRequiredItis,
  CritterSchema,
  CritterUpdate,
  DetailedCritterChildSchema,
  DetailedCritterCollectionUnit,
  DetailedCritterParentSchema,
  DetailedCritterQualitativeMeasurementSchema,
  DetailedCritterQuantitativeMeasurementSchema,
  DetailedManyCritterSchema,
  ICritter,
  IDetailedCritterChild,
  IDetailedCritterCollectionUnit,
  IDetailedCritterParent,
  IDetailedCritterQualitativeMeasurement,
  IDetailedCritterQuantitativeMeasurement,
  IDetailedManyCritter,
  SimilarCritterQuery
} from '../schemas/critter-schema';
import { apiError } from '../utils/types';
import { Repository } from './base-repository';

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
    critter_comment: true
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
      orderBy: {
        create_timestamp: 'desc'
      }
    });

    if (!result.length) {
      throw apiError.notFound(`Failed to find critters.`, [
        'CritterRepository -> getAllCritters',
        'results had a length of 0'
      ]);
    }

    return result;
  }

  /**
   * Get multiple critters by critter ids.
   *
   * @async
   * @param {string[]} critter_ids - array of critter ids.
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getMultipleCrittersByIds(critter_ids: string[]): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      where: { critter_id: { in: critter_ids } },
      select: this._critterProperties,
      orderBy: {
        create_timestamp: 'desc'
      }
    });

    return result;
  }

  /**
   * Get multiple critters with additional properties by critter ids.
   * Used to continue supporting BCTW integration.
   *
   * Additional properties include:
   *    mortality: mortality_id + mortality_timestamp.
   *    collection_units: relevant collection_unit related properties.
   *
   * @async
   * @param {string[]} critter_ids - array of critter ids.
   * @returns {Promise<IDetailedManyCritter[]>} array of critter objects.
   *
   */
  async getMultipleCrittersByIdsDetailed(critter_ids: string[]): Promise<IDetailedManyCritter[]> {
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
          c.critter_comment,
          json_agg(json_build_object(
            'mortality_id', m.mortality_id,
            'mortality_timestamp', m.mortality_timestamp
          )) as mortality,
          json_agg(json_build_object(
            'critter_collection_unit_id', u.critter_collection_unit_id,
            'collection_category_id', l.collection_category_id,
            'collection_unit_id', x.collection_unit_id,
            'unit_name', x.unit_name,
            'category_name', l.category_name
          )) as collection_units
        FROM critter c
        JOIN mortality m
          ON c.critter_id = m.critter_id
        JOIN critter_collection_unit u
          ON c.critter_id = u.critter_id
        JOIN xref_collection_unit x
          ON x.collection_unit_id = u.collection_unit_id
        JOIN lk_collection_category l
          ON l.collection_category_id = x.collection_category_id
        WHERE c.critter_id = ANY(${critter_ids}::uuid[])
        GROUP BY c.critter_id;`,
      z.array(DetailedManyCritterSchema)
    );

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
      select: this._critterProperties
    });

    if (!result) {
      throw apiError.notFound(`Failed to find specific critter.`, [
        'CritterRepository -> getCritterById',
        'result was undefined'
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
   * @returns {Promise<ICritter[]>} array of critter objects.
   */
  async getCrittersByWlhId(wlhId: string): Promise<ICritter[]> {
    const result = await this.prisma.critter.findMany({
      where: { wlh_id: wlhId },
      select: this._critterProperties,
      orderBy: {
        create_timestamp: 'desc'
      }
    });

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
  async updateCritter(critterId: string, critterData: CritterUpdate): Promise<ICritter> {
    try {
      const result = await this.prisma.critter.update({
        where: {
          critter_id: critterId
        },
        data: critterData,
        select: this._critterProperties
      });

      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to update critter.`, [
        'CritterRepository -> updateCritter',
        'prisma threw error',
        err
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
  async createCritter(critterData: CritterCreateRequiredItis): Promise<ICritter> {
    try {
      const result = await this.prisma.critter.create({
        data: critterData,
        select: this._critterProperties
      });

      return result;
    } catch (err) {
      throw apiError.sqlExecuteIssue(`Failed to create critter.`, [
        'CritterRepository -> createCritter',
        'prisma threw error',
        err
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
          (c.animal_id ILIKE ${query.critter?.animal_id}
          AND c.itis_tsn = ${query.critter?.itis_tsn})
        OR
          (pc.colour ILIKE ANY(${query.markings?.map((marking) => marking.primary_colour)})
          AND x.body_location ILIKE ANY(${query.markings?.map((marking) => marking.body_location)})
          AND t.name ILIKE ANY(${query.markings?.map((marking) => marking.marking_type)}))
        OR
          (t.name ILIKE ANY(${query.markings?.map((marking) => marking.marking_type)})
          AND m.identifier ILIKE ANY(${query.markings?.map((marking) => marking.identifier)}));`,
      z.array(CritterSchema)
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
  async findCritterQualitativeMeasurements(critterId: string): Promise<IDetailedCritterQualitativeMeasurement[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          m.measurement_qualitative_id,
          m.taxon_measurement_id,
          m.qualitative_option_id,
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
      z.array(DetailedCritterQualitativeMeasurementSchema)
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
  async findCritterQuantitativeMeasurements(critterId: string): Promise<IDetailedCritterQuantitativeMeasurement[]> {
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
      z.array(DetailedCritterQuantitativeMeasurementSchema)
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
  async findCritterCollectionUnits(critterId: string): Promise<IDetailedCritterCollectionUnit[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.critter_collection_unit_id,
          l.collection_category_id,
          x.collection_unit_id,
          x.unit_name,
          l.category_name
        FROM critter_collection_unit c
        JOIN xref_collection_unit x
          ON x.collection_unit_id = c.collection_unit_id
        JOIN lk_collection_category l
          ON l.collection_category_id = x.collection_category_id
        WHERE c.critter_id = ${critterId}::uuid;`,
      z.array(DetailedCritterCollectionUnit)
    );

    return result;
  }

  /**
   * Find a critter's parents.
   *
   * A child critter that shares the same family as a parent critter.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterParent[]>}
   */
  async findCritterParents(critterId: string): Promise<IDetailedCritterParent[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          p.family_id,
          f.family_label,
          p.parent_critter_id
        FROM family_parent p
        LEFT JOIN family f
          ON p.family_id = f.family_id
        WHERE p.parent_critter_id = ${critterId}::uuid;`,
      DetailedCritterParentSchema.array()
    );

    return result;
  }

  /**
   * Find a critter's children.
   *
   * A parent critter that shares the same family as a child critter.
   *
   * @async
   * @param {string} critterId - critter id.
   * @returns {Promise<IDetailedCritterChild[]>}
   */
  async findCritterChildren(critterId: string): Promise<IDetailedCritterChild[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.family_id,
          f.family_label,
          c.child_critter_id
        FROM family_child c
        LEFT JOIN family f
          ON c.family_id = f.family_id
        WHERE c.child_critter_id = ${critterId}::uuid;`,
      z.array(DetailedCritterChildSchema)
    );

    return result;
  }
}
