import { z } from "zod";
import { MarkingCreateBodySchema, MarkingVerificationSchema, markingIncludesSchema } from "./marking.utils";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { zodID } from "../../utils/zod_helpers";
import { MarkingUpdateBodySchema } from "./marking.utils";
import { routes } from "../../utils/constants";

const TAG = 'Markings'
export const SwaggerMarkingResponseValidation = markingIncludesSchema.omit({
    lk_colour_marking_primary_colour_idTolk_colour: true,
    lk_colour_marking_secondary_colour_idTolk_colour: true,
    lk_colour_marking_text_colour_idTolk_colour: true,
    lk_marking_type: true,
    lk_marking_material: true,
    xref_taxon_marking_body_location: true
  }).extend({
    body_location: z.string().nullable(),
    marking_type: z.string().nullable(),
    marking_material:  z.string().nullable(),
    primary_colour:z.string().nullable(),
    secondary_colour: z.string().nullable(),
    text_colour:  z.string().nullable(),
  })

const getMarkingById: ZodOpenApiOperationObject = {
  operationId: 'getMarkingById',
    summary: 'Get a marking by id',
    tags: [TAG],
    requestParams: {
        path: z.object( { id: zodID }),
    },
    responses: { 
        '200': {
            description: 'Successfully returned marking',
            content: { 
                'application/json': {
                    schema: SwaggerMarkingResponseValidation
                }
            }
        }
    }
}

const updateMarkingById: ZodOpenApiOperationObject = {
  operationId: 'updateMarkingById',
    summary: 'Update a marking by id',
    tags: [TAG],
    requestParams: {
        path: z.object( { id: zodID }),
    },
    requestBody: {
      content: {
        'application/json' : {
          schema: MarkingUpdateBodySchema
        }
      }
    },
    responses: { 
        '200': {
            description: 'Successfully updated marking',
            content: { 
                'application/json': {
                    schema: SwaggerMarkingResponseValidation
                }
            }
        }
    }
}

const deleteMarkingById: ZodOpenApiOperationObject = {
  operationId: 'deleteMarkingById',
    summary: 'Delete a marking by id',
    tags: [TAG],
    requestParams: {
        path: z.object( { id: zodID }),
    },
    responses: { 
        '200': {
            description: 'Successfully returned marking',
            content: { 
                'application/json': {
                    schema: SwaggerMarkingResponseValidation
                }
            }
        }
    }
}

const getMarkingsByCritterId: ZodOpenApiOperationObject = {
  operationId: 'getMarkingsByCritterId',
  tags: [TAG],
  summary: 'Get all markings attached to the critter using the provided critter id.',
  requestParams: {
    path: z.object( { id: zodID }),
  },
  responses: { 
    '200': {
        description: 'Successfully returned markings of critter.',
        content: { 
            'application/json': {
                schema: SwaggerMarkingResponseValidation.array()
            }
        }
    }
  }
}

const verifyMarkings: ZodOpenApiOperationObject = {
  operationId: 'verifyMarkings',
  tags: [TAG],
  summary: 'Verify whether the supplied markings can be attached to a specific taxon using the taxon_id.',
  requestBody: {
    content: {
      'application/json' : {
        schema: MarkingVerificationSchema
      }
    }
  },
  responses: { 
    '200': {
        description: 'Successfully returned markings of critter.',
        content: { 
            'application/json': {
                schema: z.object({verified: z.boolean(), invalid_marking: zodID.array() })
            }
        }
    }
  }
}

const createMarking: ZodOpenApiOperationObject = {
  operationId: 'createMarking',
  tags: [TAG],
  summary: 'Create a marking.',
  requestBody: {
    content: {
      'application/json' : {
        schema: MarkingCreateBodySchema
      }
    }
  },
  responses: { 
    '200': {
        description: 'Successfully returned markings of critter.',
        content: { 
            'application/json': {
                schema: SwaggerMarkingResponseValidation
            }
        }
    }
  }
}

const getAllMarkings: ZodOpenApiOperationObject = {
  operationId: 'getAllMarkings',
  tags: [TAG],
  summary: 'Get all markings from the db.',
  responses: { 
    '200': {
        description: 'Successfully returned all markings.',
        content: { 
            'application/json': {
                schema: SwaggerMarkingResponseValidation.array()
            }
        }
    }
  }
}

export const markingPaths = {
  [`${routes.markings}`]: {
    get: getAllMarkings
  },
  [`${routes.markings}/create`]: {
    post: createMarking
  },
  [`${routes.markings}/verify`]: {
    get: verifyMarkings
  },
  [`${routes.markings}/critter/{id}`]: {
    post: getMarkingsByCritterId
  },
  [`${routes.markings}/{id}`]: {
    get: getMarkingById,
    put: updateMarkingById,
    delete: deleteMarkingById
  },
}