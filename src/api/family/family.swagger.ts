import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { routes } from "../../utils/constants";
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from "../../utils/swagger_helpers";
import { zodID } from "../../utils/zod_helpers";
import { FamilyChildCreateBodySchema, FamilyChildSchema, FamilyCreateBodySchema, FamilyParentCreateBodySchema, FamilyParentSchema, FamilySchema } from "./family.utils";

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
    ...SwagUnauthorized,
    ...SwagNotFound,
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
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
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
    ...SwagUnauthorized,
    ...SwagNotFound,
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
    ...SwagUnauthorized,
    ...SwagNotFound,
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
    ...SwagUnauthorized,
    ...SwagNotFound,
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
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}


const SwagParentsCreate: ZodOpenApiOperationObject = {
  operationId: 'createParentsOfFamily',
  summary: 'Creates a parent record for a know family',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyParentCreateBodySchema,
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: FamilyParentSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const SwagDeleteParents: ZodOpenApiOperationObject = {
  operationId: 'deletesParentsOfFamily',
  summary: 'Deletes parent record for a know family',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyParentCreateBodySchema,
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: FamilyParentSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const SwagCreateChildOfFamily: ZodOpenApiOperationObject = {
  operationId: 'createsChildOfFamily',
  summary: 'Creates child of family',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyChildCreateBodySchema,
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: FamilyChildSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const SwagDeleteChildOfFamily: ZodOpenApiOperationObject = {
  operationId: 'deletesChildOfFamily',
  summary: 'Deletes child of family',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyChildCreateBodySchema,
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: FamilyChildSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const critterArr = z.string().array();
const SwagGetImmediateFamilyOfCritter: ZodOpenApiOperationObject = {
  operationId: 'immediateFamilyOfCritter',
  summary: 'Gets all immediate family members of critter id',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: z.object({children: critterArr,  siblings: critterArr, parents: critterArr})
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const SwagGetImmediateSiblingsChildren: ZodOpenApiOperationObject = {
  operationId: 'immediateSiblingsChildrenOfCritter',
  summary: 'Gets immediate parents and children of critter id',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: z.object({children: critterArr,  parents: critterArr})
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const SwagUpdateImmediateSiblingsChildrenOfCritter: ZodOpenApiOperationObject = {
  operationId: 'immediateSiblingsChildrenOfCritter',
  summary: 'Updates immediate parents and children of critter id',
  tags: [TAG],
  ...reqIdParam,
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyCreateBodySchema,
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: FamilySchema,
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const SwagDeleteFamilyOfCritter: ZodOpenApiOperationObject = {
  operationId: 'deleteFamilyOfCritter',
  summary: 'Deletes family associations of critter',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: FamilySchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

const SwagGetFamilyByLabel: ZodOpenApiOperationObject = {
  operationId: 'getFailyByLabel',
  summary: 'Gets family by label value',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: FamilySchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  }
}

export const familyPaths = {
  [routes.family]: {
    get: SwagGetAllFamilies
  },
  [`${routes.family}/${routes.create}`]: {
    post: SwagCreateFamily,
  },
  [`${routes.family}/{id}`]: {
    get: SwagGetImmediateSiblingsChildren,
    put: SwagUpdateImmediateSiblingsChildrenOfCritter,
    delete: SwagDeleteFamilyOfCritter
  },
  [`${routes.family}/immediate/{id}`]: {
    get: SwagGetImmediateFamilyOfCritter,
  },
  [`${routes.family}/children`]: {
    get: SwagGetFamilyChildren,
    delete: SwagDeleteChildOfFamily,
    post: SwagCreateChildOfFamily,
  },
  [`${routes.family}/children/{id}`]: {
    get: SwagGetCritterChildren,
  },
  [`${routes.family}/parents/{id}`]: {
    get: SwagGetCritterParents,
  },
  [`${routes.family}/parents`]: {
    get: SwagGetFamilyParents,
    delete: SwagParentsCreate,
    post: SwagDeleteParents,
  },
  [`${routes.family}/label/{label}`]: {
    get: SwagGetFamilyByLabel,
  },

}
