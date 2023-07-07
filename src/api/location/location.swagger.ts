import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { zodID } from "../../utils/zod_helpers";
import { LocationCreateSchema, LocationResponseSchema, LocationSchema, LocationUpdateSchema } from "./location.utils";
export const SwagDesc = {
  get: 'Successful operation',
  create: 'Created successfully',
  delete: 'Deleted successfully',
  update: 'Updated successfully'
}

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
  responses: {
    '200': {
      description: SwagDesc.get,
      ...formattedLocationContent
    }
  }
}

export const SwagCreateLocation: ZodOpenApiOperationObject = {
  operationId: 'createLocation',
  summary: 'Create a location. These are usually associated to captures and mortalities',
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
    }
  }
}
export const SwagUpdateLocation: ZodOpenApiOperationObject = {
  operationId: 'updateLocation',
  summary: 'Updates location. These are usually associated to captures and mortalities',
  ...reqIdParam,
  requestBody: {
    content: {
      'application/json': {
        schema: LocationUpdateSchema,
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.update,
      ...defaultLocationContent
    }
  }
}
export const SwagGetLocation: ZodOpenApiOperationObject = {
  operationId: 'getLocation',
  summary: 'Get location by id',
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.get,
      ...formattedLocationContent
    }
  }
}
export const SwagDeleteLocation: ZodOpenApiOperationObject = {
  operationId: 'getLocation',
  summary: 'Get location by id',
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.get,
      ...formattedLocationContent
    }
  }
}
