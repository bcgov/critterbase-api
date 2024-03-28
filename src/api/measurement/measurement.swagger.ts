import { z } from 'zod';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagNotFound } from '../../utils/swagger_helpers';
import { zodID } from '../../utils/zod_helpers';
import {
  QualitativeCreateSchema,
  QualitativeSchema,
  QuantitativeCreateSchema,
  QuantitativeSchema,
  QuantitativeUpdateSchema
} from './measurement.utils';

const TAG = 'Measurement';
const reqIdParam = {
  requestParams: {
    path: z.object({ id: zodID })
  }
};

const QualitativeResponseSchema = QualitativeSchema.extend({
  measurement_name: z.string().nullable(),
  option_label: z.string().nullable(),
  option_value: z.string().nullable()
});

const QuantitativeResponseSchema = QuantitativeSchema.extend({
  measurement: z.string().nullable()
});

//ALl Measurements
const GetAllMeasurements: ZodOpenApiOperationObject = {
  operationId: 'getAllMeasurements',
  summary: 'Gets all Measurements, both Qualitative and Quantitative',
  tags: [TAG],
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: z.object({
            measurements: z.object({
              qualitative: QualitativeSchema.array(),
              quantitative: QuantitativeSchema.array()
            })
          })
        }
      }
    },
    ...SwagErr
  }
};

const GetQualMeasurement: ZodOpenApiOperationObject = {
  operationId: 'getQualMeasurementById',
  summary: 'Get Qualitative Measurement by measurement id.',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: QualitativeResponseSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

const DeleteQualMeasurement: ZodOpenApiOperationObject = {
  operationId: 'getQualMeasurementById',
  summary: 'Delete Qualitative Measurement by measurement id.',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.delete,
      content: {
        'application/json': {
          schema: QualitativeSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

const UpdateQualMeasurement: ZodOpenApiOperationObject = {
  operationId: 'updateQualMeasurementById',
  summary: 'Update Qualitative Measurement by measurement id.',
  tags: [TAG],
  ...reqIdParam,
  requestBody: {
    content: {
      'application/json': {
        schema: QualitativeCreateSchema
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: QualitativeSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

const GetQuantMeasurement: ZodOpenApiOperationObject = {
  operationId: 'getQuantMeasurementById',
  summary: 'Get Quantitative Measurement by measurement id.',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: QuantitativeResponseSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

const DeleteQuantMeasurement: ZodOpenApiOperationObject = {
  operationId: 'getQuantMeasurementById',
  summary: 'Delete Quantitative Measurement by measurement id.',
  tags: [TAG],
  ...reqIdParam,
  responses: {
    '200': {
      description: SwagDesc.delete,
      content: {
        'application/json': {
          schema: QuantitativeSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

const UpdateQuantMeasurement: ZodOpenApiOperationObject = {
  operationId: 'updateQuantMeasurementById',
  summary: 'Update Quantitative Measurement by measurement id.',
  tags: [TAG],
  ...reqIdParam,
  requestBody: {
    content: {
      'application/json': {
        schema: QuantitativeUpdateSchema
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: QuantitativeSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

const CreateQuantMeasurement: ZodOpenApiOperationObject = {
  operationId: 'createQuantMeasurementById',
  summary: 'Create Quantitative Measurement',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: QuantitativeCreateSchema
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: QuantitativeSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

const CreateQualMeasurement: ZodOpenApiOperationObject = {
  operationId: 'createQualMeasurementById',
  summary: 'Create Qualitative Measurement',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: QualitativeCreateSchema
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: QualitativeSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagErr
  }
};

//Qualitative Measurements

export const measurementPaths = {
  [routes.measurements]: {
    get: GetAllMeasurements
  },
  [`${routes.measurements}/qualitative/{id}`]: {
    get: GetQualMeasurement,
    delete: DeleteQualMeasurement,
    patch: UpdateQualMeasurement
  },
  [`${routes.measurements}/qualitative/${routes.create}`]: {
    post: CreateQualMeasurement
  },
  [`${routes.measurements}/quantitative/{id}`]: {
    get: GetQuantMeasurement,
    delete: DeleteQuantMeasurement,
    patch: UpdateQuantMeasurement
  },
  [`${routes.measurements}/quantitative/${routes.create}`]: {
    post: CreateQuantMeasurement
  }
};
