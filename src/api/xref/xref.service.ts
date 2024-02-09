import { Service } from "../../utils/base_classes";
import { XrefRepository } from "./xref.repository";

export class XrefService extends Service<XrefRepository> {
  constructor(repository?: XrefRepository) {
    super(repository ?? new XrefRepository());
  }
  /**
   * Gets 'collection units' from a category id.
   *
   * @async
   * @param {string} category_id - uuid primary key of xref_collection_unit.
   * @returns {Promise<ICollectionUnitDef[]>}
   */
  async getCollectionUnitsFromCategoryId(category_id: string) {
    return this.repository.getCollectionUnitsFromCategoryId(category_id);
  }

  /**
   * Get 'collection unit categories' for a TSN.
   *
   * Includes all 'collection unit categories' for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<ICollectionCategoryDef[]>}
   */
  async getTsnCollectionCategories(tsn: number) {
    return this.repository.getTsnCollectionCategories(tsn);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'marking body locations' definitions for a TSN.
   *
   * Includes all 'marking body locations' definitions for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<IMarkingBodyLocationDef[]>}
   */
  async getTsnMarkingBodyLocations(tsn: number) {
    const tsns = await this.itis.getTsnHierarchy(tsn);

    return this.repository.getTsnMarkingBodyLocations(tsns);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'qualitative measurements' for a TSN.
   *
   * Includes all 'qualitative measurements' for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<IQualitativeMeasurementDef[]>}
   */
  async getTsnQualitativeMeasurements(tsn: number) {
    const tsns = await this.itis.getTsnHierarchy(tsn);

    return this.repository.getTsnQualitativeMeasurements(tsns);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'quantitative measurements' defintions for a TSN.
   *
   * Includes all 'quantitative measurements' definitions for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<IQuantitativeMeasurementDef[]>}
   */
  async getTsnQuantitativeMeasurements(tsn: number) {
    const tsns = await this.itis.getTsnHierarchy(tsn);

    return this.repository.getTsnQuantitativeMeasurements(tsns);
  }

  /**
   * Get all 'qualitative measurement options'
   *
   * @async
   * @param {string} taxonMeasurementId - qualitative measurement identifier.
   * @returns {Promise<IQualitativeMeasurementOption[]>}
   */
  async getQualitativeMeasurementOptions(taxonMeasurementId: string) {
    return this.repository.getQualitativeMeasurementOptions(taxonMeasurementId);
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all 'measurements' definitions for a TSN. Both qualitative and quantitative.
   *
   * Includes all 'measurements' definitions for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @returns {Promise<Array<IQualitativeMeasurementDef | IQuantitativeMeasurementDef>>}
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
