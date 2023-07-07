import { ZodOpenApiOperationObject } from 'zod-openapi';
import {z} from 'zod';
import { zodID } from '../../utils/zod_helpers';
import { CritterDefaultResponseSchema, CritterDetailedResponseSchema } from './critter.utils';

export const getCritterById: ZodOpenApiOperationObject = {
    operationId: 'getCritterById',
    summary: 'Get a critter by id',
    requestParams: {
        path: z.object( { id: zodID })
    },
    responses: { 
        '200': {
            description: 'Successfully returned critter',
            content: { 
                'application/json': {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponse" }
                        ]
                    }
                }
            }
        }
    }
}