import { CritterbasePrisma } from "../../utils/base_classes";
import { QueryFormats } from "../../utils/types";
import { XrefRepository } from "./xref.repository";

export class XrefService extends CritterbasePrisma {
  format?: QueryFormats;

  constructor(format?: QueryFormats) {
    super();
    this.format = format;
  }

  /**
   * Gets 'collection units' from a category id.
   *
   * Optionally can return as the 'select' format.
   *
   * @async
   * @param {string} category_id - uuid primary key of xref_collection_unit.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getCollectionUnitsFromCategoryId(category_id: string) {
    const xrefRepository = new XrefRepository();

    if (this.format === QueryFormats.asSelect) {
      return await xrefRepository.asSelect_getCollectionUnitsFromCategoryId(
        category_id,
      );
    }

    return xrefRepository.getCollectionUnitsFromCategoryId(category_id);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get 'collection unit categories' for a TSN.
   * Includes all 'collection unit categories' for hierarchies above.
   *
   * Optionally can return as the 'select' format.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnCollectionCategories(tsn: number) {
    const xrefRepository = new XrefRepository();

    if (this.format === QueryFormats.asSelect) {
      return await xrefRepository.asSelect_getTsnCollectionCategories(tsn);
    }

    return xrefRepository.getTsnCollectionCategories(tsn);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'marking body locations' definitions for a TSN.
   * Includes all 'marking body locations' definitions for hierarchies above.
   *
   * Optionally can return as 'select' format.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnMarkingBodyLocations(tsn: number) {
    const xrefRepository = new XrefRepository();

    if (this.format === QueryFormats.asSelect) {
      return await xrefRepository.asSelect_getTsnMarkingBodyLocations(tsn);
    }

    return xrefRepository.getTsnMarkingBodyLocations(tsn);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'qualitative measurements' for a TSN.
   * Includes all 'qualitative measurements' for hierarchies above.
   *
   * Optionally can return as 'select' format.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnQualitativeMeasurements(tsn: number) {
    const xrefRepository = new XrefRepository();

    if (this.format === QueryFormats.asSelect) {
      return await xrefRepository.asSelect_getTsnQualitativeMeasurements(tsn);
    }

    return xrefRepository.getTsnQualitativeMeasurements(tsn);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'quantitative measurements' defintions for a TSN.
   * Includes all 'quantitative measurements' definitions for hierarchies above.
   *
   * Optionally can return as 'select' format.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnQuantitativeMeasurements(tsn: number) {
    const xrefRepository = new XrefRepository();

    if (this.format === QueryFormats.asSelect) {
      return await xrefRepository.asSelect_getTsnQuantitativeMeasurements(tsn);
    }

    return xrefRepository.getTsnQuantitativeMeasurements(tsn);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'quantitative measurement options' for a TSN.
   * Includes all 'quantitative measurement options' for hierarchies above.
   *
   * Optionally can return as 'select' format.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnQuantitativeMeasurementOptions(tsn: number) {
    const xrefRepository = new XrefRepository();

    if (this.format === QueryFormats.asSelect) {
      return await xrefRepository.asSelect_getTsnQualitativeMeasurementOptions(
        tsn,
      );
    }

    return xrefRepository.getTsnQualitativeMeasurementOptions(tsn);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'measurements' definitions for a TSN. Both qualitative and quantitative.
   * Includes all 'measurements' definitions for hierarchies above.
   *
   * Optionally can return as 'select' format.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async getTsnMeasurements(tsn: number) {
    const quant = await this.getTsnQuantitativeMeasurements(tsn);
    const qual = await this.getTsnQualitativeMeasurements(tsn);

    return [...quant, ...qual];
  }
  //TODO: find alternative to this endpoint
  // async getCollectionUnitsFromCategory(
  //   category_name: string,
  //   taxon_name_common?: string,
  //   taxon_name_latin?: string,
  // ) {
  //   const taxon_categories =
  //     await prisma.xref_taxon_collection_category.findFirstOrThrow({
  //       where: {
  //         lk_taxon: {
  //           taxon_name_common: taxon_name_common
  //             ? { equals: taxon_name_common, mode: "insensitive" }
  //             : undefined,
  //           taxon_name_latin: taxon_name_latin
  //             ? { equals: taxon_name_latin, mode: "insensitive" }
  //             : undefined,
  //         },
  //         lk_collection_category: {
  //           category_name: { equals: category_name, mode: "insensitive" },
  //         },
  //       },
  //     });
  //   const category_id = taxon_categories.collection_category_id;
  //   return await getCollectionUnitsFromCategoryId(category_id);
  // }
}
