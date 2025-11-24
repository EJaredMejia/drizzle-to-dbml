import type { DBMLTableRelationsId } from "@/packages/dbml/dbml-relations/types/dbml-relations.types";
import type { DBML_COLUMN_TYPES } from "../constants/dbml-column.constants";

export type DBMLColumnType = (typeof DBML_COLUMN_TYPES)[number] | `varchar(${number})`;

export type DBMLColumnPropertiesStatic = "pk" | "increment" | "not null" | "unique";

export type DBMLColumnProperty =
  | DBMLColumnPropertiesStatic
  | `ref: ${DBMLTableRelationsId}${string}` // foreign key reference
  | `default: ${string}` // default value
  | `note: ${string}`; // column comment

export type DBMLAddPropertyParams =
  | DBMLColumnPropertiesStatic
  | { key: "default"; value: "now()" | (string & {}) | number | boolean }
  | { key: "note"; value: string };
