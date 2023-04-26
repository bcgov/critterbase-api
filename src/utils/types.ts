/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, critter } from ".prisma/client";
import { z } from "zod";
import { IResponseSchema, ResponseSchema } from "./zod_helpers";
type uuid = string;
/**
 ** Custom Critterbase Error. Includes a status code with the message.
 */
type ErrorType =
  | "requiredProperty"
  | "syntaxIssue"
  | "serverIssue"
  | "notFound"
  | "conflict";

class apiError extends Error {
  status: number;
  errorType?: ErrorType;

  constructor(message?: string, status?: number, errorType?: ErrorType) {
    super(message ?? "Unknown error occurred");
    this.status = status ?? 400;
    this.errorType = errorType;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   ** Property required in the payload or query params
   */
  static requiredProperty(propertyName: string) {
    return new apiError(
      `${propertyName} is required and must be provided in request`,
      400,
      "requiredProperty"
    );
  }

  /**
   ** Requested resource / object was not found
   */
  static notFound(message: string) {
    return new apiError(message, 404, "notFound");
  }

  /**
   ** Structural or syntax issue with payload or query
   */
  static syntaxIssue(message: string) {
    return new apiError(message, 400, "syntaxIssue");
  }

  /**
   ** Internal server issue or problem occurs
   */
  static serverIssue() {
    return new apiError(`Internal Server Error`, 500, "serverIssue");
  }

  /**
   ** Request conflicts with current state of the target resource
   */
  static conflictIssue(message: string) {
    return new apiError(message, 409, "conflict");
  }

  toString(): string {
    return `error: ${this.message}`;
  }
}

type DateAuditColumns = Pick<critter, "create_timestamp" | "update_timestamp">;

type UserAuditColumns = Pick<critter, "update_user" | "create_user">;

type AuditColumns = DateAuditColumns & UserAuditColumns;

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

interface Dropdown {
  key: string;
  id: uuid;
  value: string;
}

enum QueryFormats {
  default = "default",
  detailed = "detailed",
  dropdown = "dropdown",
}

type PrismaIncludes = Prisma.HasInclude | Prisma.HasSelect;

interface FormatParseBody {
  schema: IResponseSchema;
  prismaIncludes?: PrismaIncludes;
}
interface FormatParse {
  [QueryFormats.default]?: FormatParseBody;
  [QueryFormats.detailed]?: FormatParseBody;
  [QueryFormats.dropdown]?: FormatParseBody; //used in UI's for select/dropdowns
}

export {
  apiError,
  AuditColumns,
  Implements,
  FormatParse,
  QueryFormats,
  Dropdown,
  FormatParseBody,
};
