/**
 ** Custom Critterbase Error. Includes a status code with the message.
 */
type ErrorType =
  | "requiredProperty"
  | "syntaxIssue"
  | "serverIssue"
  | "notFound";

class apiError {
  message: string;
  status: number;
  errorType?: ErrorType;

  constructor(message: string, status?: number, errorType?: ErrorType) {
    this.message = message;
    this.status = status ?? 400;
    this.errorType = errorType;
  }

  static requiredProperty(propertyName: string) {
    return new apiError(propertyName, 400, "requiredProperty");
  }

  static notFound(message: string) {
    return new apiError(message, 404, "notFound");
  }

  static syntaxIssue(message: string) {
    return new apiError(message, 400, "syntaxIssue");
  }

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

export { apiError };
