type DateAuditColumns = {
  created_at: Date;
  updated_at: Date;
};

type UserAuditColumns = {
  create_user: string;
  update_user: string;
};

type AuditColumns = DateAuditColumns & UserAuditColumns;
