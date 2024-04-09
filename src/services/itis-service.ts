import axios, { AxiosError } from 'axios';
import { IItisProperties, IItisSolrStub } from '../schemas/itis-schema';
import { apiError } from '../utils/types';
import { ExternalService } from './base-service';

/**
 * Service to use ITIS Web Services (Web Service + Solr).
 *
 * ITIS Web Service Endpoints: https://itis.gov/ws_description.html
 * ITIS Solr Service: https://itis.gov/solr_documentation.html
 *
 * @export
 * @class ItisWebService
 */
export class ItisService extends ExternalService {
  solrServiceUrl: string;

  /**
   * Currently supported ITIS endpoints
   *
   */
  webServiceEndpoints = {
    TSN_HIERARCHY: 'getFullHierarchyFromTSN',
    TSN_FULL_RECORD: 'getFullRecordFromTSN'
  };

  constructor() {
    super(process.env.ITIS_WEB_SERVICE);
    this.solrServiceUrl = process.env.ITIS_SOLR_SERVICE;
  }

  /**
   * Sends an axios request to ITIS webservice.
   *
   * @async
   * @template T - Generic ITIS response type.
   * @param {string} endpoint - ITIS webservice endpoint.
   * @param {string} [query] - ITIS endpoint query.
   * @throws {Error} - Error if itis endpoint does not respond.
   * @returns {Promise<T>} - Generic ITIS response.
   */
  async _itisWebServiceGetRequest<T>(endpoint: string, query?: string): Promise<T> {
    const baseUrl = `${this.externalServiceUrl}/${endpoint}`;

    const url = query ? `${baseUrl}?${query}` : baseUrl;

    try {
      const res = await axios.get<T>(url);

      return res.data;
    } catch (err) {
      const axiosError = err as AxiosError;

      throw apiError.requestIssue(`No response from ITIS Web Service`, [
        'ItisWebService -> _itisWebServiceGetRequest',
        `axios error: ${axiosError.message} `,
        url
      ]);
    }
  }

  /**
   * Send an axios request to ITIS Solr service.
   *
   * @async
   * @template T - Generic ITIS Solr response type.
   * @param {string} solrQuery - query to pass to request.
   * @returns {Promise<T>} Generic ITIS Solr response.
   */
  async _itisSolrSearch(solrQuery: string) {
    const url = `${this.solrServiceUrl}/?wt=json&omitHeader=true&q=${solrQuery}`;

    try {
      const res = await axios.get<IItisSolrStub>(url);

      return res.data.response.docs;
    } catch (err) {
      const axiosError = err as AxiosError;

      throw apiError.requestIssue(`No response from ITIS Solr Service`, [
        'ItisWebService -> _itisWebServiceGetRequest',
        `axios error: ${axiosError.message}`,
        url
      ]);
    }
  }

  _splitSolrHierarchyStringToArray(solrHiearchy: string) {
    return solrHiearchy.split('$').filter(Number).map(Number);
  }

  /**
   * Search ITIS Solr service for reference of TSN. Parse commonly used values from response.
   *
   * @async
   * @param {number} searchTsn - ITIS TSN.
   * @throws {apiError.notFound} - If unable to find ITIS TSN.
   * @returns {Promise<{tsn: number, tsnHierarchy: number[], scientificName: string}>}
   */
  async searchSolrByTsn(searchTsn: number) {
    const result = await this._itisSolrSearch(`tsn:${searchTsn}`);
    // This is almost certaintly one value in docs array when searching for tsn.
    // To be safe searching for the tsn in the docs array.
    const solrTaxon = result.find((taxon) => taxon.tsn === String(searchTsn));

    if (!solrTaxon) {
      throw apiError.notFound(`ITIS was unable to find TSN for '${searchTsn}'.`, [
        'ItisWebService -> searchSolrForTsn',
        'probably invalid TSN'
      ]);
    }

    const { tsn, hierarchyTSN, nameWOInd } = solrTaxon;

    const tsnHierarchy = this._splitSolrHierarchyStringToArray(hierarchyTSN[0]);

    return { tsn: Number(tsn), tsnHierarchy, scientificName: nameWOInd };
  }

  /**
   * Retrieves the taxon hierarchy ABOVE the provided TSN (includes provied TSN taxon).
   * Will not return children below TSN. ie: A species does not return sub-species.
   *
   * @async
   * @param {number} searchTsn - ITIS TSN primary identifier.
   * @returns {Promise<number[]>} Promise array of ITIS taxon hierarchy objects and TSNs.
   */
  async getTsnHierarchy(searchTsn: number) {
    const { tsnHierarchy } = await this.searchSolrByTsn(searchTsn);

    if (tsnHierarchy[tsnHierarchy.length - 1] !== searchTsn) {
      throw apiError.requestIssue(`ITIS TSN produced invalid hierarchy.`, ['ItisWebService -> getTsnHierarchy']);
    }

    return tsnHierarchy;
  }

  async getTsnsHierarchyMap(searchTsns: number[]) {
    const uniqueSearchTsns = [...new Set(searchTsns)];
    const solrQuery = uniqueSearchTsns.map((tsn) => `tsn:${tsn}`).join('+');
    const result = await this._itisSolrSearch(solrQuery);

    const tsnHiearchyMap = new Map<number, number[]>();

    for (const tsn of searchTsns) {
      const solrTaxon = result.find((taxon) => taxon.tsn === String(tsn));

      if (solrTaxon) {
        tsnHiearchyMap.set(tsn, this._splitSolrHierarchyStringToArray(solrTaxon.hierarchyTSN[0]));
      }
    }

    return tsnHiearchyMap;
  }

  /**
   * Get taxon scientific name from ITIS TSN.
   *
   * Using Solr service for efficiency.
   * Regular web service will timeout if unable to find resource.
   *
   * @async
   * @param {string} searchTsn - ITIS TSN identifier.
   * @throws {apiError.notFound} - if ITIS is unable to find scientific name.
   * @returns {Promise<number>} ITIS scientific taxon name.
   */
  async getScientificNameFromTsn(searchTsn: number) {
    const { scientificName } = await this.searchSolrByTsn(searchTsn);

    return scientificName;
  }

  /**
   * Get a TSN from taxon scientific name.
   *
   * Using Solr service for efficiency.
   * Regular web service will timeout if unable to find resource.
   *
   * Note: encoding space characters in scientificName. ie: ' ' -> '\%20'.
   *
   * @async
   * @param {string} scientificName - ITIS scientific name (case insensitive).
   * @throws {apiError.notFound} - if ITIS is unable to find TSN.
   * @returns {Promise<number>} ITIS TSN identifier.
   */
  async getTsnFromScientificName(scientificName: string) {
    const encodedScientificName = scientificName.replace(' ', `\\%20`);
    const solrQuery = `nameWOInd:${encodedScientificName}`;

    const result = await this._itisSolrSearch(solrQuery);

    const foundTaxon = result.find((itisTaxon) => itisTaxon.nameWOInd.toUpperCase() === scientificName.toUpperCase());

    if (!foundTaxon) {
      throw apiError.notFound(`Unable to translate scientific name to ITIS TSN`, [
        'ItisWebService -> getTsnFromScientificName',
        `'${scientificName}' returned undefined`
      ]);
    }

    return Number(foundTaxon.tsn);
  }

  /**
   * Patches an object which contains 'itis_tsn' or 'itis_scientific_name'.
   * Goal to keep sync with ITIS tsn <-> scientific name relation.
   *
   * ie: Object contains property itis_tsn, does lookup for scientific name of
   * that tsn and patches the object's scientific name. Same for inverse.
   *
   * @async
   * @template T - extends Partial<IItisProperties>
   * @param {T} objectToPatch - initial object with partial itis properties.
   * @throws {apiError.syntaxIssue} - missing both itis_tsn and itis_scientific_name
   * @throws {apiError.syntaxIssue} - missing itis_scientific_name
   * @returns {Promise<T & Required<IItisProperties>>} new object with properties filled in.
   */
  async patchTsnAndScientificName<T extends Partial<IItisProperties>>(
    objectToPatch: T
  ): Promise<T & Required<IItisProperties>> {
    /**
     * Throw error if neither tsn nor scientific name provided.
     */
    if (!objectToPatch.itis_scientific_name && !objectToPatch.itis_tsn) {
      throw apiError.syntaxIssue('itis_tsn and itis_scientific_name missing in object');
    }

    /**
     * TSN takes precedence over scientific name
     * Patch scientific name with found value from provided TSN
     */
    if (objectToPatch.itis_tsn) {
      const scientificName = await this.getScientificNameFromTsn(objectToPatch.itis_tsn);

      return {
        ...objectToPatch,
        itis_tsn: objectToPatch.itis_tsn,
        itis_scientific_name: scientificName
      };
    }

    /**
     * Throw error if no scientific name. (nothing to patch object with)
     */
    if (!objectToPatch.itis_scientific_name) {
      throw apiError.syntaxIssue('itis_scientific_name missing in object');
    }

    /**
     * If no TSN, then patch with TSN found from provided scientific name
     */
    const tsn = await this.getTsnFromScientificName(objectToPatch.itis_scientific_name);

    return {
      ...objectToPatch,
      itis_tsn: tsn,
      itis_scientific_name: objectToPatch.itis_scientific_name
    };
  }
}
