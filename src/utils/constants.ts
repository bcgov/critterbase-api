import { getDBClient } from '../client/client';
import { Context } from './context';
import { QueryFormats } from './types';

const PORT = process.env.PORT ?? 9000;

const IS_DEV = process.env.NODE_ENV === 'development';

const IS_PROD = process.env.NODE_ENV === 'production';

const IS_TEST = process.env.NODE_ENV === 'test';

const KEYCLOAK_URL = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`;

const KEYCLOAK_ISSUER = `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}`;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV: 'development' | 'test' | 'production';
      DB_URL: string;
      AUTHENTICATE: string;
      ITIS_WEB_SERVICE: string;
      ITIS_SOLR_SERVICE: string;
    }
  }
}

// Augment the Express Request interface.
declare module 'express-serve-static-core' {
  export interface Request {
    context?: Context;
  }
}

// Get the Prisma client singleton.
const prisma = getDBClient();

const api = '/api';
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
  create: 'create',
  id: ':id'
};

const defaultFormat = QueryFormats.default;

export {
  IS_DEV,
  IS_PROD,
  IS_TEST,
  KEYCLOAK_ISSUER,
  KEYCLOAK_URL,
  PORT,
  // request,
  defaultFormat,
  prisma,
  routes
};
