import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import console from "console";
import type { Request } from "express";
import { array, z } from "zod";
import { FormatParsers, QueryFormats } from "./types";
import { QueryFormatSchema } from "./zod_helpers";
/**
 ** Formats a prisma error messsage based on the prisma error code
 * @param code string
 * @param meta Record<string, unknown> | undefined -> unknown object shape
 * @returns string -> formatted error message
 * Note: as unsupported error messages occur, add support using this function
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const prismaErrorMsg = (
  err: PrismaClientKnownRequestError
): { error: string; status: number } => {
  const { meta, message, code } = err;
  switch (code) {
    case "P2025":
      return {
        error: `${JSON.stringify(meta?.cause) || message}`,
        status: 404,
      };
    case "P2002":
      return {
        error: `unique constraint failed on the fields: ${JSON.stringify(
          meta?.target
        )}`,
        status: 400,
      };
    case "P2003":
      return {
        error: `foreign key constraint failed on the field: ${JSON.stringify(
          meta?.field_name
        )}`,
        status: 404,
      };
  }
  console.log(`NEW PRISMA ERROR: ${JSON.stringify(err)}`);
  return { error: `unsupported prisma error: "${code}"`, status: 400 };
};

const intersect = <T>(A: Array<T>, B: Array<T>): Array<T> => {
  const setB = new Set(B);
  return Array.from(new Set(A)).filter(x => setB.has(x))
}

const sessionHours = (hours: number) => hours * 3600000;

const getFormat = (req: Request): QueryFormats =>
  QueryFormatSchema.parse(req.query).format;

const formatParse = async <TParse extends FormatParsers>(
  format: QueryFormats,
  service: Promise<Record<string, unknown> | Record<string, unknown>[]>,
  formatParse: TParse
) => {
  const serviceData = await service;
  const isArray = Array.isArray(serviceData);
  const Parser = formatParse[format]?.schema;
  if (!Parser) {
    return serviceData;
  }
  return isArray ? array(Parser).parse(serviceData) : Parser.parse(serviceData);
};

export { prismaErrorMsg, sessionHours, formatParse, getFormat, intersect };
