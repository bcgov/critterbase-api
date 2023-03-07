/**
 ** Custom Critterbase Error. Includes a status code with the message.
 */
type ErrorType =
  | "default"
  | "requiredProperty"
  | "syntaxIssue"
  | "serverIssue"
  | "notFound";

class apiError extends Error {
  status: number;
  errorType?: ErrorType;

  constructor(message: string, status?: number, errorType?: ErrorType) {
    super(message);
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
  static serverIssue(message?: string) {
    return new apiError(message ?? "Internal Server Error", 500, "serverIssue");
  }

  toString() {
    return `error: ${this.message} `;
  }

  toDevString() {
    return {
      message: this.message,
      status: this.status,
      errorType: this.errorType,
    };
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
