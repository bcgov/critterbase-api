import { apiError } from "../utils/types";
import { Repository } from "./base-repository";
import {
  ICollectionCategoryDef,
  ICollectionUnitDef,
  ITsnMarkingBodyLocation,
  ITsnQualitativeMeasurement,
  ITsnQualitativeMeasurementOption,
  TsnQualitativeMeasurementSchema,
} from "../schemas/xref-schema";
import { Prisma } from "@prisma/client";

export class XrefRepository extends Repository {
  /**
   * Get 'collection units' from category_id.
   *
   * @async
   * @param {string} category_id - primary key of 'xref_collection_unit'.
   * @returns {Promise<ICollectionUnitDef[]>}
   */
  async getCollectionUnitsFromCategoryId(
    category_id: string
  ): Promise<ICollectionUnitDef[]> {
    const result = await this.prisma.xref_collection_unit.findMany({
      where: {
        collection_category_id: category_id,
      },
    });

    if (!result.length) {
      throw apiError.sqlExecuteIssue("Failed to find collection units.", [
        "XrefRepository -> getTsnCollectionCategories",
        "results had length of 0",
      ]);
    }

    return result;
  }

  /**
   * Get 'collection categories' for a TSN.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<ICollectionCategoryDef[]>}
   */
  async getTsnCollectionCategories(
    tsn: number
  ): Promise<ICollectionCategoryDef[]> {
    const result = await this.prisma.$queryRaw<ICollectionCategoryDef[]>`
      SELECT cc.collection_category_id, cc.category_name, cc.description, x.itis_tsn
      FROM lk_collection_category cc
      INNER JOIN xref_taxon_collection_category x
      ON x.collection_category_id = cc.collection_category_id
      AND x.itis_tsn = ${tsn};`;

    if (!result.length) {
      throw apiError.sqlExecuteIssue(`Failed to find collection categories.`, [
        "XrefRepository -> getTsnCollectionCategories",
        "results had length of 0",
      ]);
    }

    return result;
  }

  /**
   * Get 'marking body locations' for array of TSNs.
   *
   * @async
   * @param {number[]} tsns - ITIS TSN identifiers.
   * @returns {Promise<ITsnMarkingBodyLocation[]>}
   */
  async getTsnMarkingBodyLocations(
    tsns: number[]
  ): Promise<ITsnMarkingBodyLocation[]> {
    const result = await this.prisma.xref_taxon_marking_body_location.findMany({
      where: { itis_tsn: { in: tsns } },
      select: {
        taxon_marking_body_location_id: true,
        itis_tsn: true,
        body_location: true,
        description: true,
      },
    });

    if (!result.length) {
      throw apiError.sqlExecuteIssue(`Failed to find marking body locations.`, [
        "XrefRepository -> getTsnMarkingBodyLocations",
        "results had length of 0",
      ]);
    }

    return result;
  }

  /**
   * Get 'qualitative measurements' for array of TSNs.
   *
   * @async
   * @param {number[]} tsns - ITIS TSN identifiers.
   * @returns {Promise<ITsnQualitativeMeasurement[]>}
   */
  async getTsnQualitativeMeasurements(
    tsns: number[]
  ): Promise<ITsnQualitativeMeasurement[]> {
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
            'taxon_measurement_id', o.taxon_measurement_id,
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

    if (!result.length) {
      throw apiError.sqlExecuteIssue(
        `Failed to find qualitative measurements.`,
        [
          "XrefRepository -> getTsnQualitativeMeasurements",
          "results had length of 0",
        ]
      );
    }

    return result;
  }

  /**
   * Get 'qualitative measurement options' for taxon_measurement_id
   *
   * @async
   * @param {string} taxonMeasurementId - primary key of xref_taxon_measurement_qualitative
   * @returns {Promise<ITsnQualitativeMeasurementOption>}
   */
  async getQualitativeMeasurementOptions(
    taxonMeasurementId: string
  ): Promise<ITsnQualitativeMeasurementOption[]> {
    const result =
      await this.prisma.xref_taxon_measurement_qualitative_option.findMany({
        where: { taxon_measurement_id: taxonMeasurementId },
        select: {
          qualitative_option_id: true,
          taxon_measurement_id: true,
          option_value: true,
          option_label: true,
          option_desc: true,
        },
      });

    if (!result.length) {
      throw apiError.sqlExecuteIssue(
        `Failed to find qualitative measurement options.`,
        [
          "XrefRepository -> getTsnQualitativeMeasurements",
          "results had a length of 0",
        ]
      );
    }

    return result;
  }

  /**
   * Get 'quantitative measurements' definitions for array of TSNs.
   *
   * @async
   * @param {number[]} tsns - ITIS TSN identifiers.
   * @returns {Promise<ITsnQuantitativeMeasurement[]>}
   */
  async getTsnQuantitativeMeasurements(tsns: number[]) {
    const result =
      await this.prisma.xref_taxon_measurement_quantitative.findMany({
        where: { itis_tsn: { in: tsns } },
        select: {
          taxon_measurement_id: true,
          itis_tsn: true,
          measurement_name: true,
          min_value: true,
          max_value: true,
          unit: true,
        },
      });

    if (!result.length) {
      throw apiError.sqlExecuteIssue(
        `Failed to find quantitative measurement.`,
        [
          "XrefRepository -> getTsnQuantitativeMeasurements",
          "results had a length of 0",
        ]
      );
    }

    return result;
  }
}
