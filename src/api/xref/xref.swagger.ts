import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { SwagDesc } from "../../utils/swagger_helpers";
import { XrefCollectionUnitSchema, XrefTaxonCollectionCategorySchema, XrefTaxonMarkingBodyLocationSchema, taxonIdSchema } from "../../utils/zod_helpers";
import {
    CollectionUnitCategoryIdSchema,
    CollectionUnitCategorySchema,
  } from "./xref.utils";
import { routes } from "../../utils/constants";

const TAG = "Xref";

export const xrefSchemas = {
    xrefCollectionUnitsDefaultSchema: XrefCollectionUnitSchema.array(),
    xrefCollectionTaxonCategoryDefaultSchema: XrefTaxonCollectionCategorySchema.array(),
    xrefTaxonMarkingLocationDefaultSchema: XrefTaxonMarkingBodyLocationSchema.array()
}

const formats = z.enum(['asSelect']).optional();
const getXrefCollectionUnits: ZodOpenApiOperationObject = {
    operationId: "getXrefCollectionUnits",
    summary: "Get all collection units available in the DB. To filter by category, provide either just a category_id, or provide a category name plus a taxon_name_latin or taxon_name_common.",
    tags: [TAG],
    requestParams: {
        query: CollectionUnitCategorySchema.extend({ category_name: z.string().optional(), ...CollectionUnitCategoryIdSchema.shape, format: formats })
    },
    responses: {
        "200": {
        description: SwagDesc.get,
        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        { "$ref" : "#/components/schemas/xrefCollectionUnitsDefaultSchema" },
                        { "$ref" : "#/components/schemas/asSelectSchema" },
                    ]
                }
            },
        },
        },
    },
}

const getCollectionTaxonCategories: ZodOpenApiOperationObject = {
    operationId: "getCollectionTaxonCategories",
    summary: "Get all collection to taxon category mappings available in the DB.",
    tags: [TAG],
    requestParams: {
        query: taxonIdSchema.extend({format: formats})
    },
    responses: {
        "200": {
        description: SwagDesc.get,
        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        { "$ref" : "#/components/schemas/xrefCollectionTaxonCategoryDefaultSchema" },
                        { "$ref" : "#/components/schemas/asSelectSchema" },
                    ]
                }
            },
        },
        },
    },
}

const getTaxonMarkingBodyLocations: ZodOpenApiOperationObject = {
    operationId: "getTaxonMarkingBodyLocations",
    summary: "Get all body location to taxon mappings available in the DB.",
    tags: [TAG],
    requestParams: {
        query: taxonIdSchema.extend({format: formats})
    },
    responses: {
        "200": {
        description: SwagDesc.get,
        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        { "$ref" : "#/components/schemas/xrefTaxonMarkingLocationDefaultSchema" },
                        { "$ref" : "#/components/schemas/asSelectSchema" },
                    ]
                }
            },
        },
        },
    },
}

export const xrefPaths = {
    [`${routes.xref}/collection-units`] : {
        get: getXrefCollectionUnits
    },
    [`${routes.xref}/taxon-collection-categories`] : {
        get: getCollectionTaxonCategories
    },
    [`${routes.xref}/taxon-marking-body-locations`] : {
        get: getTaxonMarkingBodyLocations
    },
}