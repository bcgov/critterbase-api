import { XrefRepository } from "../repositories/xref-repository";
import { toSelectFormat } from "../utils/helper_functions";
import { Service } from "./base-service";
import { ItisWebService } from "./itis-service";

export class XrefService extends Service<XrefRepository> {
  serviceFactory: { itisService: ItisWebService };

  // Set the default values for the constructor
  constructor(
    repository = new XrefRepository(),
    serviceFactory = { itisService: new ItisWebService() },
  ) {
    super(repository);
    this.serviceFactory = serviceFactory;
  }

  /**
   * Gets 'collection units' from a category id.
   *
   * @async
   * @param {string} category_id - uuid primary key of xref_collection_unit.
   * @returns {Promise<ICollectionUnitDef[]>}
   */
  async getCollectionUnitsFromCategoryId(
    category_id: string,
    asSelect = false,
  ) {
    const data =
      await this.repository.getCollectionUnitsFromCategoryId(category_id);

    if (asSelect) {
      return toSelectFormat(data, "collection_unit_id", "unit_name");
    }
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
  async getTsnCollectionCategories(tsn: number, asSelect = false) {
    const data = await this.repository.getTsnCollectionCategories(tsn);

    if (asSelect) {
      return toSelectFormat(data, "collection_category_id", "category_name");
    }

    return data;
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
  async getTsnMarkingBodyLocations(tsn: number, asSelect = false) {
    const tsns = await this.serviceFactory.itisService.getTsnHierarchy(tsn);

    const data = await this.repository.getTsnMarkingBodyLocations(tsns);

    if (asSelect) {
      return toSelectFormat(
        data,
        "taxon_marking_body_location_id",
        "body_location",
      );
    }

    return data;
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
  async getTsnQualitativeMeasurements(tsn: number, asSelect = false) {
    const tsns = await this.serviceFactory.itisService.getTsnHierarchy(tsn);

    const data = await this.repository.getTsnQualitativeMeasurements(tsns);

    if (asSelect) {
      return toSelectFormat(data, "taxon_measurement_id", "measurement_name");
    }

    return data;
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
  async getTsnQuantitativeMeasurements(tsn: number, asSelect = false) {
    const tsns = await this.serviceFactory.itisService.getTsnHierarchy(tsn);

    const data = await this.repository.getTsnQuantitativeMeasurements(tsns);

    if (asSelect) {
      return toSelectFormat(data, "taxon_measurement_id", "measurement_name");
    }

    return data;
  }

  /**
   * Get all 'qualitative measurement options'
   *
   * @async
   * @param {string} taxonMeasurementId - qualitative measurement identifier.
   * @returns {Promise<IQualitativeMeasurementOption[]>}
   */
  async getQualitativeMeasurementOptions(
    taxonMeasurementId: string,
    asSelect = false,
  ) {
    const data =
      await this.repository.getQualitativeMeasurementOptions(
        taxonMeasurementId,
      );

    if (asSelect) {
      return toSelectFormat(data, "taxon_measurement_id", "option_value");
    }

    return data;
  }

  /**
   * HIERARCHY SERVICE
   *
   * Get all tsn 'measurements' both qualitative and quantitative.
   *
   * @async
   * @param {string} tsn - ITIS TSN identifier.
   * @returns {Promise<TODO>}
   */
  async getTsnMeasurements(tsn: number, asSelect = false) {
    const tsns = await this.serviceFactory.itisService.getTsnHierarchy(tsn);

    const quantitative =
      await this.repository.getTsnQuantitativeMeasurements(tsns);

    const qualitative =
      await this.repository.getTsnQuantitativeMeasurements(tsns);

    if (asSelect) {
      const quantitativeAsSelect = toSelectFormat(
        quantitative,
        "taxon_measurement_id",
        "measurement_name",
      );

      const qualitativeAsSelect = toSelectFormat(
        qualitative,
        "taxon_measurement_id",
        "measurement_name",
      );

      return {
        quantitative: quantitativeAsSelect,
        qualitative: qualitativeAsSelect,
      };
    }

    return { quantitative, qualitative };
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
