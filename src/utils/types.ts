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
   ** Internal server issue or problem occurs
   */
   static conflictIssue(message: string) {
    return new apiError(message, 409, "conflict");
  }

  toString(): string {
    return `error: ${this.message}`;
  }
}

type DateAuditColumns = {
  created_at: Date;
  updated_at: Date;
};

type UserAuditColumns = {
  create_user: string;
  update_user: string;
};

type AuditColumns = DateAuditColumns & UserAuditColumns;

export { apiError, AuditColumns };
