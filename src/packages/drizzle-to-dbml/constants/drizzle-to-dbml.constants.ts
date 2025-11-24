export const drizzleDeclarationTables = new Set(["pgTable", "mysqlTable", "sqliteTable"]);

export const DRIZZLE_COLUMN_TYPES = {
  VARCHAR: "varchar",
  SERIAL: "serial",
  INTEGER: "integer",
  NUMERIC: "numeric",
  BOOLEAN: "boolean",
  TIMESTAMP: "timestamp",
} as const;

export const DRIZZLE_COLUMN_TYPE_PROPERTIES = {
  LENGTH: "length",
  WITH_TIMEZONE: "withTimezone",
} as const;

export const DRIZZLE_COLUMN_PROPERTIES = {
  DEFAULT: "default",
  NOT_NULL: "notNull",
  PRIMARY_KEY: "primaryKey",
  UNIQUE: "unique",
} as const;

export const DRIZZLE_INDEXES = {
  UNIQUE: "unique",
  FOREIGN_KEY: "foreignKey",
  UNIQUE_INDEX: "uniqueIndex",
  INDEX: "index",
} as const;
