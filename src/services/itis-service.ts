import axios from "axios";
import {
  IItisGetFullHierarchyResponse,
  IItisStub,
} from "../schemas/itis-schema";

/**
 * Service to use ITIS web services.
 *
 * @export
 * @class Itis
 */
export class ItisWebService {
  webServiceUrl: string;

  /**
   * Currently supported ITIS endpoints
   *
   */
  endpoints = {
    TSN_HIERARCHY: "getFullHierarchyFromTSN",
    TSN_FULL_RECORD: "getFullRecordFromTSN",
  };

  constructor() {
    if (!process.env.ITIS_WEB_SERVICE) {
      throw new Error("MISSING ENVIRONMENT VARIABLE: 'ITIS_WEB_SERVICE'");
    }
    this.webServiceUrl = process.env.ITIS_WEB_SERVICE;
  }

  /**
   * Sends an axios request to ITIS webservice.
   *
   * @async
   * @template TItisResponse - Generic ITIS response type.
   * @param {string} endpoint - ITIS webservice endpoint.
   * @param {string} [query] - ITIS endpoint query.
   * @throws {Error} - Error if itis endpoint does not respond.
   * @returns {Promise<TItisResponse>} - Generic ITIS response.
   */
  async _itisGetRequest<TItisResponse>(
    endpoint: string,
    query?: string,
  ): Promise<TItisResponse> {
    const baseUrl = `${this.webServiceUrl}/${endpoint}`;

    const url = query ? `${baseUrl}?${query}` : baseUrl;

    const res = await axios.get<TItisResponse>(url);

    if (!res.data) {
      throw new Error(`No response from ITIS endpoint: ${endpoint}`);
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
    const result = await this._itisGetRequest<
      IItisGetFullHierarchyResponse<number>
    >(this.endpoints.TSN_HIERARCHY, `tsn=${tsn}`);

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
   * @async
   * @param {number | string} tsn - ITIS TSN primary identifier.
   * @returns {Promise<boolean>} Promise boolean indicator if value is an ITIS TSN.
   */
  async isValueTsn(tsn: number | string) {
    const result = await this._itisGetRequest<IItisStub>(
      this.endpoints.TSN_FULL_RECORD,
      `tsn=${tsn}`,
    );

    return Boolean(result.tsn);
  }
}
