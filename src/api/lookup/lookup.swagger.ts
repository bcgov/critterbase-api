import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from 'zod';
import { cod_confidence, coordinate_uncertainty_unit, frequency_unit, measurement_unit, sex, system } from "@prisma/client";
import { routes } from "../../utils/constants";
import { eCritterStatus } from "../critter/critter.utils";
import { LookUpColourSchema, LookUpMarkingTypeSchema, LookUpMaterialSchema, LookupCodSchema, LookupCollectionUnitCategorySchema, LookupRegionEnvSchema, LookupRegionNrSchema, LookupTaxonSchema, LookupWmuSchema, zodID } from "../../utils/zod_helpers";

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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/colourDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/regionEnvDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/regionNrDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/wmuDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/codDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/markingMaterialDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/markingTypeDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/collectionCategoryDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/taxonDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
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
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref" : "#/components/schemas/taxonDefaultSchema" },
                            { "$ref" : "#/components/schemas/asSelectSchema" },
                        ]
                    }
                }
            }
        }
    }
}

export const lookupSchemas = {
    asSelectSchema: asSelectSchema.array(),
    colourDefaultSchema: LookUpColourSchema.array(),
    regionEnvDefaultSchema: LookupRegionEnvSchema.array(),
    regionNrDefaultSchema: LookupRegionNrSchema.array(),
    wmuDefaultSchema: LookupWmuSchema.array(),
    collectionCategoryDefaultSchema: LookupCollectionUnitCategorySchema.array(),
    codDefaultSchema: LookupCodSchema.array(),
    markingMaterialDefaultSchema: LookUpMaterialSchema.array(),
    markingTypeDefaultSchema: LookUpMarkingTypeSchema.array(),
    taxonDefaultSchema: LookupTaxonSchema.array()
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