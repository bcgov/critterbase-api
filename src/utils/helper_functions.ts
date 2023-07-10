import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import console from "console";
import type { Request } from "express";
import { ZodRawShape, ZodTypeAny, array, objectOutputType } from "zod";
import { FormatParse, ISelect, QueryFormats } from "./types";
import { QueryFormatSchema } from "./zod_helpers";
import { Prisma } from "@prisma/client";
import { prisma } from "./constants";
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
        error: typeof meta?.cause === "string" ? meta.cause : message,
        status: 404,
      };
    case "P2002":
      return {
        error: `unique constraint failed on the fields: ${
          typeof meta?.target === "string" ? meta.target : "unknown fields..."
        }`,
        status: 400,
      };
    case "P2003":
      return {
        error: `foreign key constraint failed on the field: ${
          typeof meta?.fieldName === "string"
            ? meta.fieldName
            : "unknown field name..."
        }`,
        status: 404,
      };
  }
  console.log(`NEW PRISMA ERROR: ${JSON.stringify(err)}`);
  return { error: `unsupported prisma error: "${code}"`, status: 400 };
};

const intersect = <T>(A: T[], B: T[]): T[] => {
  const setB = new Set(B);
  return Array.from(new Set(A)).filter((x) => setB.has(x));
};

const sessionHours = (hours: number) => hours * 3600000;

const getFormat = (req: Request): QueryFormats =>
  QueryFormatSchema.parse(req.query).format;

type ServiceReturn = Record<string, unknown> | Record<string, unknown>[];

//TODO fully type the conditional return. Note: very difficult
const formatParse = async (
  format: QueryFormats,
  service: Promise<ServiceReturn>,
  formatParse: FormatParse
): Promise<Record<string, unknown> | Record<string, unknown>[]> => {
  const serviceData = await service;
  const isArray = Array.isArray(serviceData);
  const Parser = formatParse[format]?.schema;
  if (!Parser) {
    return serviceData;
  }
  return isArray ? array(Parser).parse(serviceData) as Record<string, unknown>[] : Parser.parse(serviceData) as Record<string, unknown>;
};

const toSelect = <AsType>(
  val: objectOutputType<ZodRawShape, ZodTypeAny, "passthrough">,
  key: keyof AsType & string,
  valueKey: keyof AsType & string
) => {
  const castVal = val as AsType;
  return {
    key,
    id: String(castVal[key]),
    value: String(castVal[valueKey]),
  } satisfies ISelect;
};

const getParentTaxonIds = async (taxon_id: string): Promise<string[]> => {
  const result: { get_taxon_ids: string[] }[] =
    await prisma.$queryRaw`SELECT * FROM get_taxon_ids(${taxon_id})`;
  if (!result.length) {
    return [];
  } else {
    return result[0].get_taxon_ids;
  }
};
//Putting the function here so tests dont run utils each time
export const prisMock = (
  model: Prisma.ModelName,
  method:
    | "findMany"
    | "findFirst"
    | "findUniqueOrThrow"
    | "update"
    | "delete"
    | "create" = "findMany",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  returns: any
) =>
  jest
    .spyOn(prisma[model], method)
    .mockImplementation()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .mockResolvedValue(returns);

export {
  prismaErrorMsg,
  sessionHours,
  formatParse,
  getFormat,
  intersect,
  toSelect,
  ServiceReturn,
  getParentTaxonIds,
};
