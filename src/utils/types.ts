/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, critter } from ".prisma/client";
import { z } from "zod";
import { critterFormats } from "../api/critter/critter.utils";

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

enum QueryFormats {
  default = "default",
  // simple = "simple",
  detailed = "detailed",
}

type PrismaIncludes = Prisma.HasInclude | Prisma.HasSelect;
interface FormatParseBody<T extends z.ZodTypeAny | undefined> {
  schema: T;
  prismaIncludes?: PrismaIncludes;
}
interface FormatParse<
  TDefault extends z.ZodTypeAny | undefined,
  TDetailed extends z.ZodTypeAny
> {
  // [QueryFormats.default]?: undefined; //placeholder, can modify if default needs parsing
  [QueryFormats.default]?: FormatParseBody<TDefault>;
  [QueryFormats.detailed]: FormatParseBody<TDetailed>;
}

type FormatParsers = typeof critterFormats; //Add additional format parsers

export {
  apiError,
  AuditColumns,
  Implements,
  FormatParse,
  FormatParsers,
  QueryFormats,
  // CritterParse,
};
