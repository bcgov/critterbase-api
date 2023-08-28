
// ! A Lot of stuff in here is just a placeholder for now. Will be updated as we go along.
export const rootAPIDoc = {
  openapi: "3.0.0",
  info: {
    version: "0.0.0",
    title: "critterbase-api",
    description: "API for CritterBase",
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "local api via node",
    },
    {
      url: "https://moe-critterbase-api-dev.apps.silver.devops.gov.bc.ca/api",
      description: "deployed api in dev environment",
    },
    {
      url: "https://moe-critterbase-api-test.apps.silver.devops.gov.bc.ca/api",
      description: "deployed api in test environment",
    },
    {
      url: "https://moe-critterbase-api-prod.apps.silver.devops.gov.bc.ca/api",
      description: "deployed api in prod environment",
    },
  ],
  tags: [],
  externalDocs: {
    description: "Visit GitHub to find out more about this API",
    url: "https://github.com/bcgov/critterbase-api.git",
  },
  paths: {},
  components: {
    securitySchemes: {
      // TODO: add security scheme
    },
    responses: {
      // TODO: update responses
      "400": {
        description: "Bad Request",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "401": {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "403": {
        description: "Forbidden",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "409": {
        description: "Conflict",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "500": {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      default: {
        description: "Unknown Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
    schemas: {
      Error: {
        // TODO: update error schema
        description: "Error response object",
        required: ["name", "status", "message"],
        properties: {
          name: {
            type: "string",
          },
          status: {
            type: "number",
          },
          message: {
            type: "string",
          },
          errors: {
            type: "array",
            items: {
              anyOf: [
                {
                  type: "string",
                },
                {
                  type: "object",
                },
              ],
            },
          },
        },
      },
    },
  },
};

// Options for the swagger docs
export const options = {
    apis: ["./src/api/**/*.ts"],
    swaggerDefinition: rootAPIDoc,
  };