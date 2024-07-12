import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import type { Request } from 'express';
import { ZodRawShape, ZodTypeAny, array, objectOutputType } from 'zod';
import { prisma } from './constants';
import { FormatParse, ISelect, QueryFormats } from './types';
import { QueryFormatSchema } from './zod_helpers';

/**
 ** Formats a prisma error messsage based on the prisma error code
 * @param code string
 * @param meta Record<string, unknown> | undefined -> unknown object shape
 * @returns string -> formatted error message
 * Note: as unsupported error messages occur, add support using this function
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const prismaErrorMsg = (err: PrismaClientKnownRequestError): { error: string; status: number } => {
  const { meta, message, code } = err;

  switch (code) {
    case 'P2025':
      return {
        error: typeof meta?.cause === 'string' ? meta.cause : message,
        status: 404
      };
    case 'P2002':
      return {
        error: `Unique constraint failed`,
        status: 400
      };
    case 'P2003':
      return {
        error: `Foreign key constraint failed`,
        status: 404
      };
  }
  return { error: `Request failed at database: "${code}"`, status: 400 };
};

const intersect = <T>(A: T[], B: T[]): T[] => {
  const setB = new Set(B);
  return Array.from(new Set(A)).filter((x) => setB.has(x));
};

const getFormat = (req: Request): QueryFormats => QueryFormatSchema.parse(req.query).format;

const isSelectFormat = (req: Request) => getFormat(req) === QueryFormats.asSelect;

export type ServiceReturn = Record<string, unknown> | Record<string, unknown>[];

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
  return isArray
    ? (array(Parser).parse(serviceData) as Record<string, unknown>[])
    : (Parser.parse(serviceData) as Record<string, unknown>);
};

const toSelect = <AsType>(
  val: objectOutputType<ZodRawShape, ZodTypeAny, 'passthrough'>,
  key: keyof AsType & string,
  valueKey: keyof AsType & string
) => {
  const castVal = val as AsType;
  return {
    key,
    id: String(castVal[key]),
    value: String(castVal[valueKey])
  } satisfies ISelect;
};

const toSelectFormat = <T>(data: T[], idKey: keyof T, valueKey: keyof T): ISelect[] =>
  data.map((item) => ({
    id: item[idKey] as string,
    key: idKey as string,
    value: item[valueKey] as string
  }));

//Putting the function here so tests dont run utils each time
const prisMock = (
  model: Prisma.ModelName,
  method: 'findMany' | 'findFirst' | 'findUniqueOrThrow' | 'update' | 'delete' | 'create',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  returns: any
) =>
  jest
    .spyOn(prisma[model], method)
    .mockImplementation()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .mockResolvedValue(returns);

export { prisMock, prismaErrorMsg, formatParse, getFormat, intersect, toSelect, isSelectFormat, toSelectFormat };
