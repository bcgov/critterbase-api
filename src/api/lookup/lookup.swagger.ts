import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from 'zod';
import { cod_confidence, coordinate_uncertainty_unit, frequency_unit, measurement_unit, sex, system } from "@prisma/client";
import { routes } from "../../utils/constants";
import { eCritterStatus } from "../critter/critter.utils";
import { zodID } from "../../utils/zod_helpers";

const availValues = 'Available values for this enumerated type.';
const availRows = 'Available rows for this type of data as specified in a lookup table.';
const TAG = 'Lookup'
const lookupCommon = {
    requestParams: {
        query: z.object( {format: z.enum(['asSelect']).optional() })
    },
    tags: [TAG]
}
const enumSex: ZodOpenApiOperationObject = {
    operationId: 'enumSex',
    requestParams: {
        query: z.object( {format: z.enum(['asSelect']).optional() })
    },
    tags: [TAG],
    responses: {
        '200' : {
            description: availValues,
            content: {
                'application/json' : {schema:  z.string().array().openapi({example: Object.keys(sex)}) }
            }
        }
    }
}

const enumCritterStatus: ZodOpenApiOperationObject = {
    operationId: 'enumCritterStatus',
    tags: [TAG],
    responses: {
        '200' : {
            description: availValues,
            content: {
                'application/json' : {schema:  z.string().array().openapi({example: Object.keys(eCritterStatus)}) }
            }
        }
    }
}

const enumCodConfidence: ZodOpenApiOperationObject = {
    operationId: 'enumCodConf',
    tags: [TAG],
    responses: {
        '200' : {
            description: availValues,
            content: {
                'application/json' : {schema:  z.string().array().openapi({example: Object.keys(cod_confidence)}) }
            }
        }
    }
}

const enumCoordinateUncertainty: ZodOpenApiOperationObject = {
    operationId: 'enumCoordUncertain',
    tags: [TAG],
    responses: {
        '200' : {
            description: availValues,
            content: {
                'application/json' : {schema:  z.string().array().openapi({example: Object.keys(coordinate_uncertainty_unit)}) }
            }
        }
    }
}

const enumFrequencyUnits: ZodOpenApiOperationObject = {
    operationId: 'enumFreqUnits',
    tags: [TAG],
    responses: {
        '200' : {
            description: availValues,
            content: {
                'application/json' : {schema:  z.string().array().openapi({example: Object.keys(frequency_unit)}) }
            }
        }
    }
}

const enumMeasurementUnit: ZodOpenApiOperationObject = {
    operationId: 'enumMeasurementUnit',
    tags: [TAG],
    responses: {
        '200' : {
            description: availValues,
            content: {
                'application/json' : {schema:  z.string().array().openapi({example: Object.keys(measurement_unit)}) }
            }
        }
    }
}

const enumSystem: ZodOpenApiOperationObject = {
    operationId: 'enumSystem',
    tags: [TAG],
    responses: {
        '200' : {
            description: availValues,
            content: {
                'application/json' : {schema:  z.string().array().openapi({example: Object.keys(system)}) }
            }
        }
    }
}

const asSelectSchema = z.object({ key: z.string(), id: zodID, value: z.string() })

const lookupColours: ZodOpenApiOperationObject = {
    operationId: 'lookupColours',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [{
                    "key": "colour_id",
                    "id": "55fd2db8-f31d-4f86-b349-89ddbcd15474",
                    "value": "Blue"
                }]}) }
            }
        }
    }
}

const lookupRegionEnvs: ZodOpenApiOperationObject = {
    operationId: 'lookupRegionEnv',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [{
                    "key": "region_env_id",
                    "id": "804bca87-240d-4833-b367-c8f1aeb6b398",
                    "value": "Peace"
                }]}) }
            }
        }
    }
}

const lookupRegionNRs: ZodOpenApiOperationObject = {
    operationId: 'lookupRegionNr',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [{
                    "key": "region_nr_id",
                    "id": "26a03e84-0185-4959-9fb5-2ad7c90242eb",
                    "value": "Cariboo Natural Resource Region"
                }]}) }
            }
        }
    }
}

const lookupWMUs: ZodOpenApiOperationObject = {
    operationId: 'lookupWmus',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [{
                    "key": "wmu_id",
                    "id": "a555aa9b-2736-4950-a9cd-1133f69fd663",
                    "value": "1-1"
                }]}) }
            }
        }
    }
}

const lookupCods: ZodOpenApiOperationObject = {
    operationId: 'lookupCods',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [{
                    "key": "cod_id",
                    "id": "8cc5a957-6132-4b5b-9040-94dcf27b2a28",
                    "value": "Harvest | Aboriginal"
                }]}) }
            }
        }
    }
}

const lookupMarkingMaterials: ZodOpenApiOperationObject = {
    operationId: 'lookupMarkingMaterials',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [{
                    "key": "marking_material_id",
                    "id": "405b7bf3-2929-4fb1-baa9-bc1e123ecbaf",
                    "value": "Metal"
                }]}) }
            }
        }
    }
}

const lookupMarkingTypes: ZodOpenApiOperationObject = {
    operationId: 'lookupMarkingTypes',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [{
                    "key": "marking_type_id",
                    "id": "d6366a17-0c47-4e5d-ab4e-4e55b7450ace",
                    "value": "Ear Tag"
                }]}) }
            }
        }
    }
}

const lookupCollectionUnitCategories: ZodOpenApiOperationObject = {
    operationId: 'lookupCollectionUnitCategories',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [ {
                    "key": "collection_category_id",
                    "id": "c8e23255-7ed2-4551-b0a4-0d980dba1298",
                    "value": "Population Unit"
                }]}) }
            }
        }
    }
}

const lookupTaxons: ZodOpenApiOperationObject = {
    operationId: 'lookupTaxons',
    ...lookupCommon,
    responses : {
        '200' : {
            description: availRows,
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [  {
                    "key": "taxon_id",
                    "id": "9cd17578-28a8-448c-8b06-10454277aedd",
                    "value": "Caribou"
                }]}) }
            }
        }
    }
}

const lookupTaxonSpecies: ZodOpenApiOperationObject = {
    operationId: 'lookupTaxonSpecies',
    ...lookupCommon,
    responses : {
        '200' : {
            description: 'Differs from normal taxon lookup in that it will filter to only rows at the "Species" level.',
            content: {
                'application/json' : {schema: asSelectSchema.array().openapi({example: [ {
                    "key": "taxon_id",
                    "id": "9cd17578-28a8-448c-8b06-10454277aedd",
                    "value": "Caribou"
                }]}) }
            }
        }
    }
}

export const enumPaths = {
    [`${routes.lookups}/enum/sex`] : {
        get: enumSex
    },
    [`${routes.lookups}/enum/critter-status`] : {
        get: enumCritterStatus
    },
    [`${routes.lookups}/enum/cod-confidence`] : {
        get: enumCodConfidence
    },
    [`${routes.lookups}/enum/coordinate-uncertainty-unit`] : {
        get: enumCoordinateUncertainty
    },
    [`${routes.lookups}/enum/frequency-unit`] : {
        get: enumFrequencyUnits
    },
    [`${routes.lookups}/enum/measurement-unit`] : {
        get: enumMeasurementUnit
    },
    [`${routes.lookups}/enum/supported-systems`] : {
        get: enumSystem
    },
    [`${routes.lookups}/colours`] : {
        get: lookupColours
    },
    [`${routes.lookups}/region-envs`] : {
        get: lookupRegionEnvs
    },
    [`${routes.lookups}/region-nrs`] : {
        get: lookupRegionNRs
    },
    [`${routes.lookups}/wmus`] : {
        get: lookupWMUs
    },
    [`${routes.lookups}/cods`] : {
        get: lookupCods
    },
    [`${routes.lookups}/marking-materials`] : {
        get: lookupMarkingMaterials
    },
    [`${routes.lookups}/marking-types`] : {
        get: lookupMarkingTypes
    },
    [`${routes.lookups}/collection-unit-categories`] : {
        get: lookupCollectionUnitCategories
    },
    [`${routes.lookups}/taxons`] : {
        get: lookupTaxons
    },
    [`${routes.lookups}/taxons/species`] : {
        get: lookupTaxonSpecies
    },
}