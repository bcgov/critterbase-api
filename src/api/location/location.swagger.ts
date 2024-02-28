import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { routes } from "../../utils/constants";
import {
  SwagDesc,
  SwagErr,
  SwagNotFound,
  SwagUnauthorized
} from "../../utils/swagger_helpers";
import { zodID } from "../../utils/zod_helpers";
import {
  LocationCreateSchema,
  LocationSchema,
  LocationUpdateSchema
} from "./location.utils";

const TAG = "Location";
const SN = z.string().nullable();
const SwagLocationResponseSchema = LocationSchema.omit({
  wmu_id: true,
  region_nr_id: true,
  region_env_id: true
}).extend({ wmu_name: SN, region_nr_name: SN, region_env_name: SN });

const defaultLocationContent = {
  content: {
    "application/json": {
      schema: LocationSchema
    }
  }
};

const formattedLocationContent = {
  content: {
    "application/json": {
      schema: SwagLocationResponseSchema
    }
  }
};

const reqIdParam = {
  requestParams: {
    path: z.object({ id: zodID })
  }
};

const SwagGetAllLocations: ZodOpenApiOperationObject = {
  operationId: "getAllLocations",
  summary: "Gets all location records.",
  tags: [TAG],
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwagLocationResponseSchema.array()
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const SwagCreateLocation: ZodOpenApiOperationObject = {
  operationId: "createLocation",
  summary:
    "Create a location. These are usually associated to captures and mortalities",
  tags: [TAG],
  requestBody: {
    content: {
      "application/json": {
        schema: LocationCreateSchema
      }
    }
  },
  responses: {
    "201": {
      description: SwagDesc.create,
      ...defaultLocationContent
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};
const SwagUpdateLocation: ZodOpenApiOperationObject = {
  operationId: "updateLocation",
  summary:
    "Updates location. These are usually associated to captures and mortalities",
  tags: [TAG],
  ...reqIdParam,
  requestBody: {
    content: {
      "application/json": {
        schema: LocationUpdateSchema
      }
    }
  },
  responses: {
    "201": {
      description: SwagDesc.update,
      ...defaultLocationContent
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};
const SwagGetLocation: ZodOpenApiOperationObject = {
  operationId: "getLocation",
  summary: "Get location by id",
  tags: [TAG],
  ...reqIdParam,
  responses: {
    "200": {
      description: SwagDesc.get,
      ...formattedLocationContent
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};
const SwagDeleteLocation: ZodOpenApiOperationObject = {
  operationId: "deleteLocation",
  summary: "Delete location by id",
  tags: [TAG],
  ...reqIdParam,
  responses: {
    "200": {
      description: SwagDesc.delete,
      ...defaultLocationContent
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

export const locationPaths = {
  [routes.locations]: {
    get: SwagGetAllLocations
  },
  [`${routes.locations}/${routes.id}`]: {
    get: SwagGetLocation,
    patch: SwagUpdateLocation,
    delete: SwagDeleteLocation
  },
  [`${routes.locations}/${routes.create}`]: {
    post: SwagCreateLocation
  }
};
