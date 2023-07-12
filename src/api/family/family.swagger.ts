import { family } from "@prisma/client";
import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { routes } from "../../utils/constants";
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";
import { zodAudit, zodID } from "../../utils/zod_helpers";
import { FamilyChildSchema, FamilyCreateBodySchema, FamilyParentSchema, FamilySchema } from "./family.utils";

const TAG = 'Family';

const defaultFamilyContent = {
  content: {
    'application/json': {
      schema: FamilySchema
    }
  }
}


const reqIdParam = {
  requestParams: {
    path: z.object({ id: zodID })
  }
}

const SwagGetAllFamilies: ZodOpenApiOperationObject = {
  operationId: 'getAllFamiles',
  summary: 'Gets all family records.',
  tags: [TAG],
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: FamilySchema.array()
        }
      }
    },
    ...SwagErr,
  }
}

const SwagCreateFamily: ZodOpenApiOperationObject = {
  operationId: 'createFamily',
  summary: 'Create a critter family association',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyCreateBodySchema,
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.create,
      ...defaultFamilyContent
    },
    ...SwagErr
  }
}
const SwagGetFamilyChildren: ZodOpenApiOperationObject = {
  operationId: 'getFamilyChildren',
  summary: 'Gets all children',
  tags: [TAG],
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: FamilyChildSchema.array()
        }
      }
    },
    ...SwagErr,
  }
}
const SwagGetFamilyParents: ZodOpenApiOperationObject = {
  operationId: 'getFamilyParents',
  summary: 'Get all parents',
  tags: [TAG],
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'appliaction/json': {
          schema: FamilyParentSchema.array()
        }
      }
    },
    ...SwagErr,
    ...SwagNotFound
  }
}
const SwagGetCritterParents: ZodOpenApiOperationObject = {
  operationId: 'getParentsOfCritterId',
  summary: 'Gets parents of critter id',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'appliaction/json': {
          schema: FamilyParentSchema.array()
        }
      }
    },
    ...SwagErr,
    ...SwagNotFound
  }
}

const SwagGetCritterChildren: ZodOpenApiOperationObject = {
  operationId: 'getChildrenOfCritterId',
  summary: 'Gets children of critter id',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'appliaction/json': {
          schema: FamilyChildSchema.array()
        }
      }
    },
    ...SwagErr,
    ...SwagNotFound
  }
}

export const familyPaths = {
  [routes.family]: {
    get: SwagGetAllFamilies
  },
  [`${routes.family}/children`]: {
    get: SwagGetFamilyChildren,
  },
  [`${routes.family}/children/${routes.id}`]: {
    get: SwagGetCritterChildren,
  },
  [`${routes.family}/parents`]: {
    get: SwagGetFamilyParents,
  },
  [`${routes.family}/parents/${routes.id}`]: {
    get: SwagGetCritterParents,
  },
  [`${routes.family}/${routes.create}`]: {
    post: SwagCreateFamily,
  },
}
