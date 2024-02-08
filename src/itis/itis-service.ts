import axios from "axios";
import {
  IItisGetFullHierarchyResponse,
  IItisHierarchy,
} from "./itis-response-types";

export class ItisService {
  webServiceUrl: string;

  constructor() {
    this.webServiceUrl = process.env.ITIS_WEB_SERVICE;
  }

  /**
   * Sends an axios request to ITIS webservice.
   *
   * @async
   * @template TItisResponse - Generic ITIS response type.
   * @param {string} endpoint - ITIS webservice endpoint.
   * @param {string} [query] - ITIS endpoint query.
   * @throws {Error} - Error if itis endpoint does not return.
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
      throw new Error(`no response from ITIS endpoint: ${endpoint}`);
    }

    return res.data;
  }

  /**
   * Retrieves the taxon hierarchy ABOVE the provided TSN (includes provied TSN taxon).
   * Will not return children below TSN. ie: A species does not return sub-species.
   *
   * @async
   * @param {number} tsn - ITIS TSN primary identifier.
   * @returns {Promise<IItisHierarchy<number>[]>} - Promise array of ITIS taxon hierarchy objects.
   */
  async getHierarchy(tsn: number) {
    const data = await this._itisGetRequest<
      IItisGetFullHierarchyResponse<number>
    >("getFullHierarchyFromTSN", `tsn=${tsn}`);

    const hierarchy: IItisHierarchy<number>[] = [];

    for (const hierarchyTaxon of data.hierarchyList) {
      // Skip adding to hierarchy if the taxon is a child of provided TSN.
      if (Number(hierarchyTaxon.parentTsn) !== tsn) {
        // Cast the TSN to a number.
        hierarchyTaxon.tsn = Number(hierarchyTaxon.tsn);
        hierarchy.push(hierarchyTaxon);
      }
    }

    return hierarchy;
  }
}
