import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";
import { zodID } from "../../utils/zod_helpers";
import { LocationCreateSchema, LocationResponseSchema, LocationSchema, LocationUpdateSchema } from "./location.utils";

const TAG = 'Locations';

const defaultLocationContent = {
  content: {
    'application/json': {
      schema: LocationSchema
    }
  }
}

const formattedLocationContent = {
  ...defaultLocationContent,
  schema: LocationResponseSchema
}

const reqIdParam = {
  requestParams: {
    path: z.object({ id: zodID })
  }
}

export const SwagGetAllLocations: ZodOpenApiOperationObject = {
  operationId: 'getAllLocations',
  summary: 'Gets all location records.',
  tags: [TAG],
  responses: {
    '200': {
      description: SwagDesc.get,
      ...formattedLocationContent
    },
    ...SwagErr,
  }
}

export const SwagCreateLocation: ZodOpenApiOperationObject = {
  operationId: 'createLocation',
  summary: 'Create a location. These are usually associated to captures and mortalities',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: LocationCreateSchema,
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.create,
      ...defaultLocationContent
    },
    ...SwagErr
  }
}
export const SwagUpdateLocation: ZodOpenApiOperationObject = {
  operationId: 'updateLocation',
  summary: 'Updates location. These are usually associated to captures and mortalities',
  tags: [TAG],
  ...reqIdParam,
  requestBody: {
    content: {
      'application/json': {
        schema: LocationUpdateSchema,
      }
    },
  },
  responses: {
    '201': {
      description: SwagDesc.update,
      ...defaultLocationContent
    },
    ...SwagErr,
    ...SwagNotFound
  }
}
export const SwagGetLocation: ZodOpenApiOperationObject = {
  operationId: 'getLocation',
  summary: 'Get location by id',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.get,
      ...formattedLocationContent
    },
    ...SwagErr,
    ...SwagNotFound
  }
}
export const SwagDeleteLocation: ZodOpenApiOperationObject = {
  operationId:'deleteLocation',
  summary: 'Delete location by id',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.delete,
      ...formattedLocationContent
    },
    ...SwagErr,
    ...SwagNotFound
  }
}
