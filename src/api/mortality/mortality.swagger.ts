import { z } from "zod";
import { CommonLocationValidation } from "../location/location.utils";
import {
  MortalityCreateSchema,
  MortalityIncludeSchema,
  MortalityUpdateSchema,
} from "./mortality.utils";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { zodID } from "../../utils/zod_helpers";
import { routes } from "../../utils/constants";
import {
  SwagDesc,
  SwagErr,
  SwagNotFound,
  SwagUnauthorized,
} from "../../utils/swagger_helpers";

export const SwaggerMortalityResponseValidation = MortalityIncludeSchema.omit({
  lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death:
    true,
  lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death:
    true,
  lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: true,
  lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: true,
}).extend({
  location: CommonLocationValidation.nullable(),
  proximate_cause_of_death: z.object({
    cod_category: z.string(),
    cod_reason: z.string().nullable(),
  }),
  ultimate_cause_of_death: z
    .object({ cod_category: z.string(), cod_reason: z.string().nullable() })
    .nullable(),
  proximate_cause_of_death_taxon: z
    .object({ taxon_id: z.string(), taxon_name_latin: z.string() })
    .nullable(),
  ultimate_cause_of_death_taxon: z
    .object({ taxon_id: z.string(), taxon_name_latin: z.string() })
    .nullable(),
});

const TAG = "Mortalities";

const getAllMortalities: ZodOpenApiOperationObject = {
  operationId: "getAllMortalities",
  summary: "Get all mortalities available in the DB.",
  tags: [TAG],
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwaggerMortalityResponseValidation.array(),
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
  },
};

const createMortality: ZodOpenApiOperationObject = {
  operationId: "createMortality",
  summary:
    "Create a new mortality. Note that you may also nest location data, which will automatically create and link a location row.",
  tags: [TAG],
  requestBody: {
    content: {
      "application/json": {
        schema: MortalityCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: SwagDesc.create,
      content: {
        "application/json": {
          schema: SwaggerMortalityResponseValidation,
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  },
};

const getMortalityByCritter: ZodOpenApiOperationObject = {
  operationId: "getMortalityByCritter",
  summary: "Get all mortalities associated with the provided critter id.",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description:
        "Retrieved all mortalities for this critter. Should only be one in most cases.",
      content: {
        "application/json": {
          schema: SwaggerMortalityResponseValidation.array(),
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  },
};

const getMortalityById: ZodOpenApiOperationObject = {
  operationId: "getMortalityById",
  summary: "Get a mortality by ID.",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwaggerMortalityResponseValidation,
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  },
};

const updateMortality: ZodOpenApiOperationObject = {
  operationId: "updateMortality",
  summary:
    "Update a mortality by ID. Note that you may also nest location data, which will update an existing associated location row, or create one if it does not exist.",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: MortalityUpdateSchema,
      },
    },
  },
  responses: {
    "200": {
      description: SwagDesc.update,
      content: {
        "application/json": {
          schema: SwaggerMortalityResponseValidation,
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  },
};

const deleteMortality: ZodOpenApiOperationObject = {
  operationId: "deleteMortality",
  summary: "Delete a mortality by ID.",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.delete,
      content: {
        "application/json": {
          schema: SwaggerMortalityResponseValidation,
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound,
  },
};

export const mortalityPaths = {
  [`${routes.mortality}`]: {
    get: getAllMortalities,
  },
  [`${routes.mortality}/create`]: {
    post: createMortality,
  },
  [`${routes.mortality}/critter/{id}`]: {
    get: getMortalityByCritter,
  },
  [`${routes.mortality}/{id}`]: {
    get: getMortalityById,
    patch: updateMortality,
    delete: deleteMortality,
  },
};
