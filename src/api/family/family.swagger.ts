import { z } from 'zod';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';
import { zodID } from '../../utils/zod_helpers';
import {
  FamilyChildCreateBodySchema,
  FamilyChildSchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema,
  FamilyParentSchema,
  FamilySchema
} from './family.utils';
import { GetCritterSchema } from '../../schemas/critter-schema';

const TAG = 'Family';
const critterArr = GetCritterSchema.array();

const defaultFamilyContent = {
  content: {
    'application/json': {
      schema: FamilySchema
    }
  }
};

const reqIdParam = {
  requestParams: {
    path: z.object({ id: zodID })
  }
};

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
    ...SwagNotFound
  }
};

const SwagCreateFamily: ZodOpenApiOperationObject = {
  operationId: 'createFamily',
  summary: 'Create a critter family association.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyCreateBodySchema
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
    ...SwagNotFound
  }
};
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
    ...SwagNotFound
  }
};
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
    ...SwagNotFound
  }
};
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
          schema: critterArr
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

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
          schema: critterArr
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const SwagParentsCreate: ZodOpenApiOperationObject = {
  operationId: 'createParentsOfFamily',
  summary: 'Registers a critter as a parent of a family',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyParentCreateBodySchema
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
    ...SwagNotFound
  }
};

const SwagDeleteParents: ZodOpenApiOperationObject = {
  operationId: 'deletesParentsOfFamily',
  summary: 'Removes a critter from being a parent of the given family.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyParentCreateBodySchema
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
    ...SwagNotFound
  }
};

const SwagCreateChildOfFamily: ZodOpenApiOperationObject = {
  operationId: 'createsChildOfFamily',
  summary: 'Registers a critter as a child of a family',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyChildCreateBodySchema
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
    ...SwagNotFound
  }
};

const SwagDeleteChildOfFamily: ZodOpenApiOperationObject = {
  operationId: 'deletesChildOfFamily',
  summary: 'Removes a critter from being a child of a given family.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyChildCreateBodySchema
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
    ...SwagNotFound
  }
};

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
          schema: z.object({
            children: critterArr,
            siblings: critterArr,
            parents: critterArr
          })
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const SwagGetParentsChildrenFromFamily: ZodOpenApiOperationObject = {
  operationId: 'getParentsChildrenFromFamily',
  summary: 'Gets immediate parents and children in a family from the given family id.',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: z.object({ children: critterArr, parents: critterArr })
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const SwagUpdateFamily: ZodOpenApiOperationObject = {
  operationId: 'updateFamily',
  summary: 'Updates metadata for a given family.',
  tags: [TAG],
  ...reqIdParam,
  requestBody: {
    content: {
      'application/json': {
        schema: FamilyCreateBodySchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: FamilySchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const SwagDeleteFamily: ZodOpenApiOperationObject = {
  operationId: 'deleteFamily',
  summary:
    'Deletes a family row. Note that all children and parent rows associated to this family must be deleted first.',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.delete,
      content: {
        'application/json': {
          schema: FamilySchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const SwagGetFamilyByLabel: ZodOpenApiOperationObject = {
  operationId: 'getFamilyByLabel',
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
    ...SwagNotFound
  }
};

export const familyPaths = {
  [routes.family]: {
    get: SwagGetAllFamilies
  },
  [`${routes.family}/${routes.create}`]: {
    post: SwagCreateFamily
  },
  [`${routes.family}/{id}`]: {
    get: SwagGetParentsChildrenFromFamily,
    patch: SwagUpdateFamily,
    delete: SwagDeleteFamily
  },
  [`${routes.family}/immediate/{id}`]: {
    get: SwagGetImmediateFamilyOfCritter
  },
  [`${routes.family}/children`]: {
    get: SwagGetFamilyChildren,
    delete: SwagDeleteChildOfFamily,
    post: SwagCreateChildOfFamily
  },
  [`${routes.family}/children/{id}`]: {
    get: SwagGetCritterChildren
  },
  [`${routes.family}/parents/{id}`]: {
    get: SwagGetCritterParents
  },
  [`${routes.family}/parents`]: {
    get: SwagGetFamilyParents,
    delete: SwagDeleteParents,
    post: SwagParentsCreate
  },
  [`${routes.family}/label/{label}`]: {
    get: SwagGetFamilyByLabel
  }
};
