import { DBClient, DBTxClient } from '../client/client';
import { XrefRepository } from '../repositories/xref-repository';
import {
  ICollectionCategory,
  ICollectionUnit,
  IMeasurementSearch,
  ITsnMarkingBodyLocation,
  ITsnMeasurements,
  ITsnQualitativeMeasurement,
  ITsnQualitativeMeasurementOption,
  ITsnQuantitativeMeasurement
} from '../schemas/xref-schema';
import { toSelectFormat } from '../utils/helper_functions';
import { ISelect, ISelectChildren } from '../utils/types';
import { Service } from './base-service';
import { ItisService } from './itis-service';

/**
 * Xref Service
 *
 * @export
 * @class XrefService
 * @implements Service
 */
export class XrefService implements Service {
  repository: XrefRepository;
  itisService: ItisService;

  /**
   * Construct XrefService class.
   *
   * @param {XrefRepository} repository - Repository dependency.
   * @param {ItisService} itisService - Itis service dependency.
   */
  constructor(repository: XrefRepository, itisService: ItisService) {
    this.repository = repository;
    this.itisService = itisService;
  }

  /**
   * Instantiate XrefService and inject dependencies.
   *
   * @static
   * @returns {XrefService}
   */
  static init(client: DBClient | DBTxClient): XrefService {
    return new XrefService(new XrefRepository(client), new ItisService());
  }

  /**
   * Gets 'collection units' from a category id.
   *
   * @async
   * @param {string} category_id - uuid primary key of xref_collection_unit.
   * @param {boolean} [asSelect] - Optional UI format indicator.
   * @returns {Promise<ICollectionCategory[] | ISelect[]>}
   */
  async getCollectionUnitsFromCategoryId(
    category_id: string,
    asSelect = false
  ): Promise<ICollectionUnit[] | ISelect[]> {
    const data = await this.repository.getCollectionUnitsFromCategoryId(category_id);

    if (asSelect) {
      return toSelectFormat(data, 'collection_unit_id', 'unit_name');
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
      const tsn = await this.itisService.getTsnFromScientificName(itis_scientific_name);
      tsns = await this.itisService.getTsnHierarchy(tsn);
    }
    const data = await this.repository.getCollectionUnitsFromCategoryOrTsns(category_name, tsns);

    if (asSelect) {
      return toSelectFormat(data, 'collection_unit_id', 'unit_name');
    }

    return data;
  }

  /**
   * Get 'collection units' from tsn hierarchy.
   *
   * @async
   * @param {number} tsn - ITIS TSN Identifier.
   * @returns {Promise<ICollectionUnitWithCategory[]>}
   */
  async findCollectionUnitsFromTsn(tsn: number) {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

    return this.repository.findCollectionUnitsFromTsns(tsns);
  }

  /**
   * Get 'collection unit categories' for a TSN.
   *
   * Includes all 'collection unit categories' for hierarchies above.
   *
   * @async
   * @param {number} tsn - ITIS TSN identifier.
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ICollectionCategory[] | ISelect[]>}
   */
  async getTsnCollectionCategories(tsn: number, asSelect = false): Promise<ICollectionCategory[] | ISelect[]> {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

    const data = await this.repository.getTsnCollectionCategories(tsns);

    if (asSelect) {
      return toSelectFormat(data, 'collection_category_id', 'category_name');
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
  async getTsnMarkingBodyLocations(tsn: number, asSelect = false): Promise<ITsnMarkingBodyLocation[] | ISelect[]> {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

    const data = await this.repository.getTsnMarkingBodyLocations(tsns);

    if (asSelect) {
      return toSelectFormat(data, 'taxon_marking_body_location_id', 'body_location');
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
      return toSelectFormat(data, 'taxon_measurement_id', 'measurement_name');
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
      return toSelectFormat(data, 'taxon_measurement_id', 'measurement_name');
    }

    return data;
  }

  /**
   * Get 'quantitative measurements' defintions by ids.
   *
   * @async
   * @param {string[]} taxonMeasurementIds - Primary keys of xref_taxon_measurement_quantitative.
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ITsnQuantitativeMeasurement[] | ISelect[]>}
   */
  async getQuantitativeMeasurementsByIds(
    taxonMeasurementIds: string[],
    asSelect = false
  ): Promise<ITsnQuantitativeMeasurement[] | ISelect[]> {
    const data = await this.repository.getQuantitativeMeasurementsByIds(taxonMeasurementIds);

    if (asSelect) {
      return toSelectFormat(data, 'taxon_measurement_id', 'measurement_name');
    }

    return data;
  }

  /**
   * Get 'qualitative measurements' defintions by ids.
   *
   * @async
   * @param {string[]} taxonMeasurementIds - Primary keys of xref_taxon_measurement_qualitative.
   * @param {boolean} [asSelect] - Format of the response.
   * @returns {Promise<ITsnQualitativeMeasurement[] | ISelect[]>}
   */
  async getQualitativeMeasurementsByIds(
    taxonMeasurementIds: string[],
    asSelect = false
  ): Promise<ITsnQualitativeMeasurement[] | ISelect[]> {
    const data = await this.repository.getQualitativeMeasurementsByIds(taxonMeasurementIds);

    if (asSelect) {
      return toSelectFormat(data, 'taxon_measurement_id', 'measurement_name');
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
    const data = await this.repository.getQualitativeMeasurementOptions(taxonMeasurementId);

    if (asSelect) {
      return toSelectFormat(data, 'taxon_measurement_id', 'option_value');
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
   * @returns {Promise<ITsnMeasurements | { qualitative: ISelectChildren[]; quantitative: ISelect[] }>}
   */
  async getTsnMeasurements(
    tsn: number,
    asSelect = false
  ): Promise<ITsnMeasurements | { qualitative: ISelectChildren[]; quantitative: ISelect[] }> {
    const tsns = await this.itisService.getTsnHierarchy(tsn);

    const quantitative = await this.repository.getTsnQuantitativeMeasurements(tsns);

    const qualitative = await this.repository.getTsnQualitativeMeasurements(tsns);

    if (asSelect) {
      const quantitativeAsSelect = toSelectFormat(quantitative, 'taxon_measurement_id', 'measurement_name');

      const qualitativeAsSelect = qualitative.map((measurement) => ({
        id: measurement.taxon_measurement_id,
        key: 'taxon_measurement_id',
        value: measurement.measurement_name,
        children: measurement.options.map((option) => ({
          id: option.qualitative_option_id,
          key: 'qualitative_option_id',
          value: option.option_label ?? 'unknown'
        }))
      }));

      return {
        quantitative: quantitativeAsSelect,
        qualitative: qualitativeAsSelect
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
   * @returns {Promise<ITsnMeasurements[]>}
   */
  async searchForMeasurements(search: IMeasurementSearch): Promise<ITsnMeasurements> {
    if (search.tsns?.length) {
      const tsnsWithHierarchy = await this.itisService.getTsnsHierarchy(search.tsns);
      // Spread the hierarchy results into the original search.tsns to include measurements applied to parent TSNs
      search.tsns = Array.from(new Set([...search.tsns, ...tsnsWithHierarchy.flatMap((tsn) => tsn.hierarchy)]));
    }

    const [qualitative, quantitative] = await Promise.all([
      this.repository.searchForQualitativeMeasurements(search),
      this.repository.searchForQuantitativeMeasurements(search)
    ]);

    return {
      quantitative,
      qualitative
    };
  }
}
