import axios from "axios";
import {
  IItisGetFullHierarchyResponse,
  IItisSolrStub,
  IItisTsnStub,
} from "../schemas/itis-schema";
import { apiError } from "../utils/types";

/**
 * Service to use ITIS Web Services (Web Service + Solr).
 *
 * ITIS Web Service Endpoints: https://itis.gov/ws_description.html
 * ITIS Solr Service: https://itis.gov/solr_documentation.html
 *
 * @export
 * @class Itis
 */
export class ItisWebService {
  webServiceUrl: string;
  solrServiceUrl: string;

  /**
   * Currently supported ITIS endpoints
   *
   */
  webServiceEndpoints = {
    TSN_HIERARCHY: "getFullHierarchyFromTSN",
    TSN_FULL_RECORD: "getFullRecordFromTSN",
  };

  constructor() {
    this.webServiceUrl = process.env.ITIS_WEB_SERVICE;
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
  async _itisWebServiceGetRequest<T>(
    endpoint: string,
    query?: string,
  ): Promise<T> {
    const baseUrl = `${this.webServiceUrl}/${endpoint}`;

    const url = query ? `${baseUrl}?${query}` : baseUrl;

    const res = await axios.get<T>(url);

    if (!res.data) {
      throw apiError.requestIssue(`No response from ITIS Web Service`, [
        "ItisWebService -> _itisWebServiceGetRequest",
        "axios returned no data",
      ]);
    }

    return res.data;
  }

  /**
   * Send an axios request to ITIS Solr service.
   *
   * @async
   * @template T - Generic ITIS Solr response type.
   * @param {string} solrQuery - query to pass to request.
   * @returns {Promise<T>} Generic ITIS Solr response.
   */
  async _itisSolrSearch<T>(solrQuery: string): Promise<T> {
    const url = `${this.solrServiceUrl}/?wt=json&omitHeader=true&q=${solrQuery}`;

    const res = await axios.get<T>(url);

    if (!res.data) {
      throw apiError.requestIssue(`No response from ITIS Solr Service`, [
        "ItisWebService -> _itisWebServiceGetRequest",
        "axios returned no data",
      ]);
    }

    return res.data;
  }

  /**
   * Retrieves the taxon hierarchy ABOVE the provided TSN (includes provied TSN taxon).
   * Will not return children below TSN. ie: A species does not return sub-species.
   *
   * @async
   * @param {number} tsn - ITIS TSN primary identifier.
   * @returns {Promise<number[]>} Promise array of ITIS taxon hierarchy objects and TSNs.
   */
  async getTsnHierarchy(tsn: number) {
    const result = await this._itisWebServiceGetRequest<
      IItisGetFullHierarchyResponse<number>
    >(this.webServiceEndpoints.TSN_HIERARCHY, `tsn=${tsn}`);

    if (!result.hierarchyList[0]) {
      throw apiError.notFound(`ITIS returned no hierarchy for this TSN`, [
        "ItisWebService -> getTsnHierarchy",
        "probably invalid TSN",
      ]);
    }

    const tsns: number[] = [];

    for (const hierarchyTaxon of result.hierarchyList) {
      // Skip adding to hierarchy if the taxon is a child of provided TSN.
      if (Number(hierarchyTaxon.parentTsn) !== tsn) {
        // Cast the TSN to a number and push into array.
        tsns.push(Number(hierarchyTaxon.tsn));
      }
    }

    return tsns;
  }

  /**
   * Checks if value is an ITIS TSN.
   *
   * Note: if value is not a TSN, ITIS returns nothing in response payload.
   *
   * @async
   * @param {number} tsn - ITIS TSN primary identifier.
   * @returns {Promise<boolean>} Promise boolean indicator if value is an ITIS TSN.
   */
  async isValueTsn(tsn: number) {
    const result = await this._itisWebServiceGetRequest<
      IItisTsnStub | undefined
    >(this.webServiceEndpoints.TSN_FULL_RECORD, `tsn=${tsn}`);

    return Number(result?.tsn) === tsn;
  }

  /**
   * Get taxon scientific name from ITIS TSN.
   *
   * Using Solr service for efficiency.
   * Regular web service will timeout if unable to find resource.
   *
   * @async
   * @param {string} tsn - ITIS TSN identifier.
   * @throws {apiError.notFound} - if ITIS is unable to find scientific name.
   * @returns {Promise<number>} ITIS scientific taxon name.
   */
  async getScientificNameFromTsn(tsn: number) {
    const solrQuery = `tsn:${tsn}`;

    const result = await this._itisSolrSearch<IItisSolrStub>(solrQuery);

    const foundTaxon = result.response.docs.find(
      (itisTaxon) => itisTaxon.tsn === String(tsn),
    );

    if (!foundTaxon) {
      throw apiError.notFound(`Unable to find scientific name for ITIS TSN`, [
        "ItisWebService -> getScientificNameFromTsn",
        `tsn: ${tsn} returned undefined`,
      ]);
    }

    return foundTaxon.nameWOInd;
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
    const encodedScientificName = scientificName.replace(" ", `\\%20`);
    const solrQuery = `nameWOInd:${encodedScientificName}`;

    const result = await this._itisSolrSearch<IItisSolrStub>(solrQuery);

    const foundTaxon = result.response.docs.find(
      (itisTaxon) =>
        itisTaxon.nameWOInd.toUpperCase() === scientificName.toUpperCase(),
    );

    if (!foundTaxon) {
      throw apiError.notFound(
        `Unable to translate scientific name to ITIS TSN`,
        [
          "ItisWebService -> getTsnFromScientificName",
          `'${scientificName}' returned undefined`,
        ],
      );
    }

    return Number(foundTaxon.tsn);
  }
}
