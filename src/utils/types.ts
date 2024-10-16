/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '.prisma/client';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { IResponseSchema } from './zod_helpers';
type uuid = string;
type CustomError = unknown;
/**
 ** Custom Critterbase Error. Includes a status code with the message.
 */
type ErrorType =
  | 'requiredProperty'
  | 'syntaxIssue'
  | 'serverIssue'
  | 'notFound'
  | 'conflict'
  | 'unauthorized'
  | 'forbidden'
  | 'sqlIssue'
  | 'requestIssue';

class apiError extends Error {
  status: number;
  errorType?: ErrorType;
  errors?: CustomError[];

  constructor(message?: string, status?: number, errorType?: ErrorType, errors?: CustomError[]) {
    super(message ?? 'Unknown error occurred');
    this.status = status ?? 400;
    this.errorType = errorType;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   ** Property required in the payload or query params
   */
  static requiredProperty(propertyName: string) {
    return new apiError(`${propertyName} is required and must be provided in request`, 400, 'requiredProperty');
  }

  /**
   ** Requested resource / object was not found
   */
  static notFound(message: string, errors?: CustomError[]) {
    return new apiError(message, 404, 'notFound', errors);
  }

  /**
   ** Structural or syntax issue with payload or query
   */
  static syntaxIssue(message: string, errors?: CustomError[]) {
    return new apiError(message, 400, 'syntaxIssue', errors);
  }

  static requestIssue(message: string, errors?: CustomError[]) {
    return new apiError(message, 400, 'requestIssue', errors);
  }

  /**
   ** Authorization headers are missing or incorrect
   */
  static unauthorized(message: string, errors?: CustomError[]) {
    return new apiError(message, 401, 'unauthorized', errors);
  }

  /**
   ** Internal server issue or problem occurs
   */
  static serverIssue(message = 'Internal Server Error', errors?: CustomError[]) {
    return new apiError(message, 500, 'serverIssue', errors);
  }

  static sqlExecuteIssue(message: string, errors?: CustomError[]) {
    return new apiError(message, undefined, 'sqlIssue', errors);
  }

  /**
   ** Request conflicts with current state of the target resource
   */
  static conflictIssue(message: string, errors?: CustomError[]) {
    return new apiError(message, 409, 'conflict', errors);
  }

  static forbidden(message: string, errors?: CustomError[]) {
    return new apiError(message, 403, 'forbidden', errors);
  }

  toString(): string {
    return `error: ${this.message}`;
  }
}

type AuditColumns = 'create_timestamp' | 'update_timestamp' | 'update_user' | 'create_user';

type Implements<Model> = {
  [key in keyof Model]-?: z.ZodType<Model[key]> extends infer T
    ? T extends z.ZodNullableType<z.ZodOptionalType<any>>
      ? z.ZodNullableType<z.ZodOptionalType<z.ZodType<Model[key]>>>
      : T extends z.ZodOptionalType<z.ZodNullableType<any>>
        ? z.ZodOptionalType<z.ZodNullableType<z.ZodType<Model[key]>>>
        : T extends z.ZodNullableType<any>
          ? z.ZodNullableType<z.ZodType<Model[key]>>
          : T extends z.ZodOptionalType<any>
            ? z.ZodOptionalType<z.ZodType<Model[key]>>
            : z.ZodType<Model[key]>
    : never;
};

interface ISelect {
  key: string;
  id: uuid;
  value: string;
}

type ISelectChildren = ISelect & { children: ISelect[] };

export enum QueryFormats {
  default = 'default',
  detailed = 'detailed',
  full = 'full',
  asSelect = 'asSelect'
}

type PrismaIncludes = Prisma.HasInclude | Prisma.HasSelect;

interface FormatParseBody {
  schema: IResponseSchema;
  prismaIncludes?: PrismaIncludes;
}
interface FormatParse {
  [QueryFormats.default]?: FormatParseBody;
  [QueryFormats.detailed]?: FormatParseBody;
  [QueryFormats.full]?: FormatParseBody;
  [QueryFormats.asSelect]?: FormatParseBody; //used in UI's for select/dropdowns
}

type ReqBody<T> = Record<string, unknown> & Partial<T>;

type PrismaTransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export { AuditColumns, FormatParse, ISelect, ISelectChildren, Implements, PrismaTransactionClient, ReqBody, apiError };
