import { XrefRepository } from "../repositories/xref-repository";
import {
  ICollectionCategoryDef,
  ICollectionUnit,
  IMeasurementSearch,
  IMeasurementWithTsnHieararchy,
  ITsnMarkingBodyLocation,
  ITsnQualitativeMeasurement,
  ITsnQualitativeMeasurementOption,
  ITsnQuantitativeMeasurement,
} from "../schemas/xref-schema";
import { toSelectFormat } from "../utils/helper_functions";
import { ISelect } from "../utils/types";
import { InternalService } from "./base-service";

export class XrefService extends InternalService<XrefRepository> {
  /**
   * Gets 'collection units' from a category id.
   *
   * @async
   * @param {string} category_id - uuid primary key of xref_collection_unit.
   * @param {boolean} [asSelect] - Optional UI format indicator.
   * @returns {Promise<ICollectionUnitDef[] | ISelect[]>}
   */
  async getCollectionUnitsFromCategoryId(
    category_id: string,
    asSelect = false
  ): Promise<ICollectionUnit[] | ISelect[]> {
    const data =
      await this.repository.getCollectionUnitsFromCategoryId(category_id);

    if (asSelect) {
      return toSelectFormat(data, "collection_unit_id", "unit_name");
    }

    return data;
  }

  /**
   * Get 'collection units' from category name OR scientific name.
   *
   * @async
   * @param {string} category_name - Name of the collection category.
   * @param {string} [itis_scientific_name] - ITIS Scientific name.
   * @param {boolean} [asSelect] - Optional UI format indicator.
   * @returns {Promise<ICollectionUnit[] | ISelect[]>}
   */
  async getCollectionUnitsFromCategoryOrScientificName(
    category_name: string,
    itis_scientific_name?: string,
    asSelect = false
  ): Promise<ICollectionUnit[] | ISelect[]> {
    let tsns: number[] = [];

    if (itis_scientific_name) {
      const tsn =
        await this.itisService.getTsnFromScientificName(itis_scientific_name);
      tsns = await this.itisService.getTsnHierarchy(tsn);
    }
    const data = await this.repository.getCollectionUnitsFromCategoryOrTsns(
      category_name,
      tsns
    );

    if (asSelect) {
      return toSelectFormat(data, "collection_unit_id", "unit_name");
    }

    return data;
  }

  /**
   * Get 'collection unit categories' for a TSN.
   *
   * Includes all 'collection unit categories' for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ICollectionCategoryDef[] | ISelect[]>}
   */
  async getTsnCollectionCategories(
    tsn: number,
    asSelect = false
  ): Promise<ICollectionCategoryDef[] | ISelect[]> {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

    const data = await this.repository.getTsnCollectionCategories(tsns);

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
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ITsnMarkingBodyLocation[] | ISelect[]>}
   */
  async getTsnMarkingBodyLocations(
    tsn: number,
    asSelect = false
  ): Promise<ITsnMarkingBodyLocation[] | ISelect[]> {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

    const data = await this.repository.getTsnMarkingBodyLocations(tsns);

    if (asSelect) {
      return toSelectFormat(
        data,
        "taxon_marking_body_location_id",
        "body_location"
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
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ITsnQualitativeMeasurement[] | ISelect[]>}
   */
  async getTsnQualitativeMeasurements(
    tsn: number,
    asSelect = false
  ): Promise<ITsnQualitativeMeasurement[] | ISelect[]> {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

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
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ITsnQuantitativeMeasurement[] | ISelect[]>}
   */
  async getTsnQuantitativeMeasurements(
    tsn: number,
    asSelect = false
  ): Promise<ITsnQuantitativeMeasurement[] | ISelect[]> {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

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
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ITsnQualitativeMeasurementOption[] | ISelect[]>}
   */
  async getQualitativeMeasurementOptions(
    taxonMeasurementId: string,
    asSelect = false
  ): Promise<ITsnQualitativeMeasurementOption[] | ISelect[]> {
    const data =
      await this.repository.getQualitativeMeasurementOptions(
        taxonMeasurementId
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
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ITsnMeasurements | ISelectChildren[]>}
   */
  async getTsnMeasurements(tsn: number, asSelect = false) {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

    const quantitative =
      await this.repository.getTsnQuantitativeMeasurements(tsns);

    const qualitative =
      await this.repository.getTsnQualitativeMeasurements(tsns);

    if (asSelect) {
      const quantitativeAsSelect = toSelectFormat(
        quantitative,
        "taxon_measurement_id",
        "measurement_name"
      );

      const qualitativeAsSelect = qualitative.map((measurement) => ({
        id: measurement.taxon_measurement_id,
        key: "taxon_measurement_id",
        value: measurement.measurement_name,
        children: measurement.options.map((option) => ({
          id: option.qualitative_option_id,
          key: "qualitative_option_id",
          value: option.option_label,
        })),
      }));

      return {
        quantitative: quantitativeAsSelect,
        qualitative: qualitativeAsSelect,
      };
    }

    return { quantitative, qualitative };
  }

  /**
   * Search for measurement definitions from properties.
   * Currently supports measurement name.
   *
   * @async
   * @param {IMeasurementSearch} search - Search properties.
   * @returns {Promise<IMeasurementWithTsnHiearchy[]>}
   */
  async searchForMeasurements(
    search: IMeasurementSearch
  ): Promise<IMeasurementWithTsnHieararchy> {
    // Search for the measurements
    const [qualitative, quantitative] = await Promise.all([
      this.repository.searchForQualitativeMeasurements(search),
      this.repository.searchForQuantitativeMeasurements(search),
    ]);

    // Get the tsns of the measurements
    const qualitativeTsns = qualitative.map(
      (measurement) => measurement.itis_tsn
    );
    const quantitativeTsns = quantitative.map(
      (measurement) => measurement.itis_tsn
    );

    // Get the tsnHiearchy map for each tsn
    const tsnHiearchyMap = await this.itisService.getTsnsHierarchyMap([
      ...qualitativeTsns,
      ...quantitativeTsns,
    ]);

    // Inject the tsn hiearchy into the measurements.
    const qualitativeWithHiearchy = qualitative.map((measurement) => ({
      ...measurement,
      tsnHierarchy: tsnHiearchyMap.get(measurement.itis_tsn) ?? [],
    }));

    const quantitativeWithHieararchy = quantitative.map((measurement) => ({
      ...measurement,
      tsnHierarchy: tsnHiearchyMap.get(measurement.itis_tsn) ?? [],
    }));

    return {
      quantitative: quantitativeWithHieararchy,
      qualitative: qualitativeWithHiearchy,
    };
  }
}
