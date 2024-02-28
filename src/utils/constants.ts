import { PrismaClient, user } from "@prisma/client";
import { QueryFormats } from "./types";
declare module "express-session" {
  interface SessionData {
    user?: user;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV: "development" | "test" | "production";
      API_KEY: string;
      DB_URL: string;
      AUTHENTICATE: string;
      ITIS_WEB_SERVICE: string;
      ITIS_SOLR_SERVICE: string;
    }
  }
}

const api = "/api";
const routes = {
  home: api,
  //routes
  critters: `${api}/critters`,
  locations: `${api}/locations`,
  markings: `${api}/markings`,
  users: `${api}/users`,
  collection_units: `${api}/collection-units`,
  artifacts: `${api}/artifacts`,
  family: `${api}/family`,
  captures: `${api}/captures`,
  mortality: `${api}/mortality`,
  measurements: `${api}/measurements`,
  lookups: `${api}/lookups`,
  bulk: `${api}/bulk`,
  xref: `${api}/xref`,
  //modifiers
  create: "create",
  id: ":id"
};

const oneDay = 60 * 60 * 24 * 1000;

const PORT = process.env.PORT;

const IS_DEV = process.env.NODE_ENV === "development";

const IS_PROD = process.env.NODE_ENV === "production";

const IS_TEST = process.env.NODE_ENV === "test";

const NO_AUTH = process.env.AUTHENTICATE === "false";

/**
 * https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 * Prevents multiple unwated instances of PrismaClient when hot reloading
 */

const globalPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  globalPrisma.prisma || new PrismaClient();

if (!IS_PROD) globalPrisma.prisma = prisma;

const strings = {
  app: {
    invalidUUID: (id: string) => `id: '${id}' is not a valid UUID`,
    idRequired: `id is required`,
    emptyBody: `body must include at least one property`
  },
  location: {
    notFoundMulti: "no locations found",
    notFound: "location not found",
    //noID: "id was not provided in params",
    deleted: (id: string): string => `Deleted location ${id}`
    // updated: (id: string): string => `Updated location ${id}`,
  },
  user: {
    notFound: "user not found",
    noData: "no new data was provided or the format was invalid",
    systemUserIdExists: "system_user_id already exists"
  },
  marking: {
    notFound: "marking not found"
  },
  artifact: {
    notFound: "artifact not found"
  }
};
const defaultFormat = QueryFormats.default;

export {
  PORT,
  IS_DEV,
  IS_PROD,
  IS_TEST,
  NO_AUTH,
  prisma,
  // request,
  strings,
  defaultFormat,
  oneDay,
  routes
};
