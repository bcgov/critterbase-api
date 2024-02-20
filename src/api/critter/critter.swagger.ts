import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  CritterIdsRequestSchema,
  UniqueCritterQuerySchema,
} from "./critter.utils";
import { routes } from "../../utils/constants";
import {
  SwagDesc,
  SwagErr,
  SwagNotFound,
  SwagUnauthorized,
} from "../../utils/swagger_helpers";
import {
  CritterSchema,
  CritterUpdateSchema,
  CritterCreateSchema,
} from "../../schemas/critter-schema";
import { QueryFormats } from "../../utils/types";

const TAG = "Critter";

export const critterSchemas = {
  defaultCritterResponse: CritterSchema,
  defaultCritterResponseArray: CritterSchema.array(),
  //TODO: update this zod schema
  detailedCritterResponse: z.string(),
};

export const critterPaths = {
  [`${routes.critters}`]: {
    /**
     * Get all critters.
     *
     */
    get: {
      operationId: "getAllCritters",
      summary: "Fetch all critters available in critterbase",
      tags: [TAG],
      requestParams: {
        query: z.object({
          wlh_id: z.string().optional(),
        }),
      },
      responses: {
        "200": {
          description:
            "Returned all critters successfully, or all critters matching WLH ID if provided.",
          content: {
            "application/json": {
              schema: CritterSchema.array(),
            },
          },
        },
        "404": {
          description:
            "Will return 404 if there were no critters matching a provided WLH ID",
        },
        ...SwagErr,
        ...SwagUnauthorized,
      },
    },
    /**
     * Get all critters by list of critter ids.
     *
     */
    post: {
      operationId: "crittersByIds",
      summary: "Retrieve specific critters by a list of IDs",
      tags: [TAG],
      requestBody: {
        content: {
          "application/json": {
            schema: CritterIdsRequestSchema, //TODO: move to critter-schema
          },
        },
      },
      responses: {
        "200": {
          description: SwagDesc.get,
          content: {
            "application/json": {
              schema: CritterSchema.array(),
            },
          },
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
      },
    },
  },
  [`${routes.critters}/unique`]: {
    /**
     * Get list of critters by semi-unique attributes.
     *
     */
    post: {
      operationId: "getUniqueCritters",
      summary: `Determine whether a critter is unique or not through various identifiable features.
    This endpoint will return an array of critters that may be partial matches to the info provided.
    Note that providing WLH ID will override the rest of the search and filter critters by WLH ID alone.`,
      tags: [TAG],
      requestParams: {
        query: z.object({ format: z.enum(["default", "detailed"]) }),
      },
      requestBody: {
        content: {
          "application/json": {
            schema: UniqueCritterQuerySchema,
          },
        },
      },
      responses: {
        "200": {
          description:
            "Returned all critters successfully, or all critters matching WLH ID if provided.",
          content: {
            "application/json": {
              schema: CritterSchema.array(),
            },
          },
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
      },
    },
  },
  [`${routes.critters}/create`]: {
    /**
     * Create a critter.
     *
     */
    post: {
      operationId: "createCritter",
      summary: "Create a new critter",
      tags: [TAG],
      requestParams: {
        path: z.object({ id: zodID }),
      },
      requestBody: {
        content: {
          "application/json": {
            schema: CritterCreateSchema,
          },
        },
      },
      responses: {
        "201": {
          description: SwagDesc.create,
          content: {
            "application/json": {
              schema: CritterSchema,
            },
          },
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
      },
    },
  },
  [`${routes.critters}/{id}`]: {
    /**
     * Get a critter by id.
     *
     */
    get: {
      operationId: "getCritterById",
      summary: "Get a critter by id (critter_id)",
      tags: [TAG],
      requestParams: {
        path: z.object({ id: zodID }),
        query: z.object({ format: z.enum([QueryFormats.detailed]).optional() }),
      },
      responses: {
        "200": {
          description: "Successfully returned critter",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: "#/components/schemas/defaultCritterResponse" },
                  { $ref: "#/components/schemas/detailedCritterResponse" },
                ],
              },
            },
          },
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
      },
    },
    /**
     * Update a critter.
     *
     */
    patch: {
      operationId: "updateCritterById",
      summary: "Update a critter by id",
      tags: [TAG],
      requestParams: {
        path: z.object({ id: zodID }),
      },
      requestBody: {
        content: {
          "application/json": {
            schema: CritterUpdateSchema,
          },
        },
      },
      responses: {
        "200": {
          description: SwagDesc.update,
          content: {
            "application/json": {
              schema: CritterSchema,
            },
          },
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
      },
    },
  },
};
