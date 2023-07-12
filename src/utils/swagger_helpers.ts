import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";

export const SwagDesc = {
  get: 'Successful operation',
  create: 'Created successfully',
  delete: 'Deleted successfully',
  update: 'Updated successfully',
  error: 'Error occurred',
  error_not_found: 'Requested resource was not found'
}

export const SwagErr: ZodOpenApiOperationObject['responses'] = {
  '400': {
    description: SwagDesc.error,
    content: {
      'application/json': {
        schema: z.object({
          error: z.string().optional(),
          errors: z.object({ "fieldName": z.string().optional() }).optional()
        })
      }
    }
  }
}

export const SwagNotFound: ZodOpenApiOperationObject['responses'] = {
  '404': {
    description: SwagDesc.error_not_found,
    content: {
      'application/json': {
        schema: z.object({ error: z.string() })
      }
    }
  }
}
