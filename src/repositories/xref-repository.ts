import { Prisma } from '@prisma/client';
import {
  CollectionCategorySchema,
  CollectionUnitSchema,
  CollectionUnitWithCategorySchema,
  ICollectionCategory,
  ICollectionUnit,
  ICollectionUnitWithCategory,
  IMeasurementSearch,
  ITsnMarkingBodyLocation,
  ITsnQualitativeMeasurement,
  ITsnQualitativeMeasurementOption,
  ITsnQuantitativeMeasurement,
  TsnQualitativeMeasurementSchema
} from '../schemas/xref-schema';
import { Repository } from './base-repository';

export class XrefRepository extends Repository {
  /**
   * Get 'collection units' from category_id.
   *
   * @async
   * @param {string} category_id - primary key of 'xref_collection_unit'.
   * @returns {Promise<ICollectionUnitDef[]>}
   */
  async getCollectionUnitsFromCategoryId(category_id: string): Promise<ICollectionUnit[]> {
    const result = await this.prisma.xref_collection_unit.findMany({
      where: {
        collection_category_id: category_id
      }
    });

    return result;
  }

  /**
   * Get 'collection units' from category name or tsn hierarchy.
   *
   * @async
   * @param {string} category_name - Name of the collection category.
   * @param {number[]} [tsns] - ITIS TSN Identifiers.
   * @returns {Promise<ICollectionUnit[]>}
   */
  async getCollectionUnitsFromCategoryOrTsns(category_name: string, tsns?: number[]): Promise<ICollectionUnit[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT c.collection_unit_id, c.collection_category_id, c.unit_name, c.description
        FROM xref_collection_unit c
        JOIN xref_taxon_collection_category x
          ON c.collection_category_id = x.collection_category_id
        JOIN lk_collection_category l
          ON l.collection_category_id = x.collection_category_id
        WHERE l.category_name ILIKE ${category_name} OR x.itis_tsn = ANY(${tsns});`,
      CollectionUnitSchema.array()
    );
    return result;
  }

  /**
   * Get 'collection units' from tsn hierarchy.
   *
   * @async
   * @param {number[]} tsns - ITIS TSN Identifiers.
   * @returns {Promise<ICollectionUnitWithCategory[]>}
   */
  async findCollectionUnitsFromTsns(tsns: number[]): Promise<ICollectionUnitWithCategory[]> {
    const result = await this.safeQuery(
      Prisma.sql`
        SELECT
          c.collection_unit_id,
          c.collection_category_id,
          l.category_name,
          c.unit_name,
          c.description
        FROM xref_collection_unit c
        JOIN lk_collection_category l
          ON c.collection_category_id = l.collection_category_id
        JOIN xref_taxon_collection_category x
          ON l.collection_category_id = x.collection_category_id
        WHERE x.itis_tsn = ANY(${tsns});`,
      CollectionUnitWithCategorySchema.array()
    );
    return result;
  }

  /**
   * Get 'collection categories' for a TSN.
   *
   * @async
   * @param {number} tsns - ITIS TSN identifiers.
   * @returns {Promise<ICollectionCategory[]>}
   */
  async getTsnCollectionCategories(tsns: number[]): Promise<ICollectionCategory[]> {
    const result = await this.safeQuery(
      Prisma.sql`
      SELECT cc.collection_category_id, cc.category_name, cc.description, x.itis_tsn
      FROM lk_collection_category cc
      INNER JOIN xref_taxon_collection_category x
      ON x.collection_category_id = cc.collection_category_id
      AND x.itis_tsn = ANY(${tsns});`,
      CollectionCategorySchema.array()
    );
    return result;
  }

  /**
   * Get 'marking body locations' for array of TSNs.
   *
   * @async
   * @param {number[]} tsns - ITIS TSN identifiers.
   * @returns {Promise<ITsnMarkingBodyLocation[]>}
   */
  async getTsnMarkingBodyLocations(tsns: number[]): Promise<ITsnMarkingBodyLocation[]> {
    const result = await this.prisma.xref_taxon_marking_body_location.findMany({
      where: { itis_tsn: { in: tsns } },
      select: {
        taxon_marking_body_location_id: true,
        itis_tsn: true,
        body_location: true,
        description: true
      }
    });

    return result;
  }

  /**
   * Get 'qualitative measurements' for array of TSNs.
   *
   * @async
   * @param {number[]} tsns - ITIS TSN identifiers.
   * @returns {Promise<ITsnQualitativeMeasurement[]>}
   */
  async getTsnQualitativeMeasurements(tsns: number[]): Promise<ITsnQualitativeMeasurement[]> {
    const result = await this.safeQuery(
      Prisma.sql`
      SELECT
        q.taxon_measurement_id,
        q.itis_tsn,
        q.measurement_name,
        q.measurement_desc,
        json_agg(
          json_build_object(
            'qualitative_option_id', o.qualitative_option_id,
            'option_label', o.option_label,
            'option_value', o.option_value,
            'option_desc', o.option_desc
          )
        ) as options
      FROM xref_taxon_measurement_qualitative q
      LEFT JOIN xref_taxon_measurement_qualitative_option o
        ON q.taxon_measurement_id = o.taxon_measurement_id
      WHERE q.itis_tsn = ANY(${tsns})
      GROUP BY q.taxon_measurement_id;`,
      TsnQualitativeMeasurementSchema.array()
    );

    return result;
  }

  /**
   * Get 'qualitative measurements' by ids.
   *
   * @async
   * @param {number[]} taxonMeasurementIds - Primary keys of xref_taxon_measurement_qualitative.
   * @returns {Promise<ITsnQualitativeMeasurement[]>}
   */
  async getQualitativeMeasurementsByIds(taxonMeasurementIds: string[]): Promise<ITsnQualitativeMeasurement[]> {
    const result = await this.safeQuery(
      Prisma.sql`
      SELECT
        q.taxon_measurement_id,
        q.itis_tsn,
        q.measurement_name,
        q.measurement_desc,
        json_agg(
          json_build_object(
            'qualitative_option_id', o.qualitative_option_id,
            'option_label', o.option_label,
            'option_value', o.option_value,
            'option_desc', o.option_desc
          )
        ) as options
      FROM xref_taxon_measurement_qualitative q
      LEFT JOIN xref_taxon_measurement_qualitative_option o
        ON q.taxon_measurement_id = o.taxon_measurement_id
      WHERE q.taxon_measurement_id = ANY(${taxonMeasurementIds}::uuid[])
      GROUP BY q.taxon_measurement_id;`,
      TsnQualitativeMeasurementSchema.array()
    );

    return result;
  }

  /**
   * Get 'qualitative measurement options' for taxon_measurement_id
   *
   * @async
   * @param {string} taxonMeasurementId - primary key of xref_taxon_measurement_qualitative
   * @returns {Promise<ITsnQualitativeMeasurementOption>}
   */
  async getQualitativeMeasurementOptions(taxonMeasurementId: string): Promise<ITsnQualitativeMeasurementOption[]> {
    const result = await this.prisma.xref_taxon_measurement_qualitative_option.findMany({
      where: { taxon_measurement_id: taxonMeasurementId },
      select: {
        qualitative_option_id: true,
        taxon_measurement_id: true,
        option_value: true,
        option_label: true,
        option_desc: true
      }
    });

    return result;
  }

  /**
   * Get 'quantitative measurements' definitions for array of TSNs.
   *
   * @async
   * @param {number[]} tsns - ITIS TSN identifiers.
   * @returns {Promise<ITsnQuantitativeMeasurement[]>}
   */
  async getTsnQuantitativeMeasurements(tsns: number[]): Promise<ITsnQuantitativeMeasurement[]> {
    const result = await this.prisma.xref_taxon_measurement_quantitative.findMany({
      where: { itis_tsn: { in: tsns } },
      select: {
        taxon_measurement_id: true,
        itis_tsn: true,
        measurement_name: true,
        min_value: true,
        max_value: true,
        measurement_desc: true,
        unit: true
      }
    });

    return result;
  }

  /**
   * Get 'quantitative measurements' defintions by ids.
   *
   * @async
   * @param {string[]} taxonMeasurementIds - Primary keys of xref_taxon_measurement_quantitative.
   * @returns {Promise<ITsnQuantitativeMeasurement[]>}
   */
  async getQuantitativeMeasurementsByIds(taxonMeasurementIds: string[]): Promise<ITsnQuantitativeMeasurement[]> {
    const result = await this.prisma.xref_taxon_measurement_quantitative.findMany({
      where: { taxon_measurement_id: { in: taxonMeasurementIds } },
      select: {
        taxon_measurement_id: true,
        itis_tsn: true,
        measurement_name: true,
        min_value: true,
        max_value: true,
        measurement_desc: true,
        unit: true
      }
    });

    return result;
  }

  /**
   * Search for 'qualitative measurements' by attributes.
   * Currently supporting measurement name.
   *
   * @async
   * @param {IMeasurementSearch} search - Search properties.
   * @param {number[]} tsns - filters for measurements applied to any of the specified TSNs
   * @returns {Promise<ITsnQuantitativeMeasurement[]>}
   */
  async searchForQuantitativeMeasurements(search: IMeasurementSearch): Promise<ITsnQuantitativeMeasurement[]> {
    const tsns = search.tsns;
    const result = await this.prisma.xref_taxon_measurement_quantitative.findMany({
      where: {
        measurement_name: { contains: search.name, mode: 'insensitive' },
        ...(tsns && tsns.length > 0 ? { itis_tsn: { in: tsns } } : {})
      },
      select: {
        taxon_measurement_id: true,
        itis_tsn: true,
        measurement_name: true,
        min_value: true,
        max_value: true,
        measurement_desc: true,
        unit: true
      }
    });

    return result;
  }

  /**
   * Search for 'quantitative measurements' by attributes.
   * Currently supporting measurement name.
   *
   * @async
   * @param {IMeasurementSearch} search - Search properties.
   * @param {number[]} tsns - filters for measurements applied to any of the specified TSNs
   * @returns {Promise<ITsnQualitativeMeasurement[]>}
   */
  async searchForQualitativeMeasurements(search: IMeasurementSearch): Promise<ITsnQualitativeMeasurement[]> {
    const tsns = search.tsns;
    const partialMatchTerm = `%${search.name}%`;

    // Build the base query
    const baseQuery = Prisma.sql`
    SELECT
      q.taxon_measurement_id,
      q.itis_tsn,
      q.measurement_name,
      q.measurement_desc,
      json_agg(
        json_build_object(
          'qualitative_option_id', o.qualitative_option_id,
          'option_label', o.option_label,
          'option_value', o.option_value,
          'option_desc', o.option_desc
        )
      ) AS options
    FROM xref_taxon_measurement_qualitative q
    LEFT JOIN xref_taxon_measurement_qualitative_option o
      ON q.taxon_measurement_id = o.taxon_measurement_id
    WHERE q.measurement_name ILIKE ${partialMatchTerm}
  `;

    // Conditionally add the itis_tsn filter if tsns is provided and has values
    const tsnsCondition = tsns && tsns.length > 0 ? Prisma.sql`AND q.itis_tsn = ANY(${tsns})` : Prisma.sql``;

    // Final query combining base query with optional condition
    const finalQuery = Prisma.sql`${baseQuery} ${tsnsCondition} GROUP BY q.taxon_measurement_id;`;

    // Execute the query
    const result = await this.safeQuery(finalQuery, TsnQualitativeMeasurementSchema.array());

    return result;
  }
}
