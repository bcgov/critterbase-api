/**
 ** Custom Critterbase Error. Includes a status code with the message.
 */
class cError {
  message: string;
  status: number;

  constructor(message: string, status?: number) {
    this.message = message;
    this.status = status ?? 400;
  }

  toString() {
    return `error: ${this.message} status: ${this.status}`;
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

export { cError };
