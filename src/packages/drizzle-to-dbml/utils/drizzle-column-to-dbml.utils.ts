import type { DBMLColumnType } from "@/packages/dbml/dbml-column/types/dbml-column.types";
import type { CallExpression } from "acorn";
import { astTraversePropertyValue } from "../utils/ast-traverse.utils";
import {
  DRIZZLE_COLUMN_TYPE_PROPERTIES,
  type DRIZZLE_COLUMN_TYPES,
} from "../constants/drizzle-to-dbml.constants";

type DrizzleColumnTypes = (typeof DRIZZLE_COLUMN_TYPES)[keyof typeof DRIZZLE_COLUMN_TYPES];
interface DrizzleColumnTypeCallbackParams {
  node: CallExpression;
}

type CallbackDrizzleColumnType = (params: DrizzleColumnTypeCallbackParams) => DBMLColumnType;

export const DBML_COLUMN_DRIZZLE_MAP = {
  varchar: createDrizzleColumnTypes(({ node }) => {
    let length = 255;
    astTraversePropertyValue(node, ({ keyNode, valueNode }) => {
      if (keyNode.name !== DRIZZLE_COLUMN_TYPE_PROPERTIES.LENGTH) {
        return;
      }

      length = Number(valueNode.value);
    });

    return `varchar(${length})`;
  }),
  serial: createDrizzleColumnTypes(() => {
    return "serial";
  }),
  integer: createDrizzleColumnTypes(() => {
    return "integer";
  }),
  numeric: createDrizzleColumnTypes(() => {
    return "numeric";
  }),
  boolean: createDrizzleColumnTypes(() => {
    return "boolean";
  }),
  timestamp: createDrizzleColumnTypes(({ node }) => {
    let isWithTimezone = false;

    astTraversePropertyValue(node, ({ keyNode, valueNode }) => {
      if (keyNode.name !== DRIZZLE_COLUMN_TYPE_PROPERTIES.WITH_TIMEZONE) {
        return;
      }

      isWithTimezone = Boolean(valueNode.value);
    });

    if (isWithTimezone) {
      return "timestamptz";
    }

    return "timestamp";
  }),
} as const satisfies Record<DrizzleColumnTypes, CallbackDrizzleColumnType>;

interface GetDBMLColumnDrizzleTypeParams extends DrizzleColumnTypeCallbackParams {
  name: string;
}
export function getDBMLColumnDrizzleType({
  name,
  node,
}: GetDBMLColumnDrizzleTypeParams): DBMLColumnType | undefined {
  return DBML_COLUMN_DRIZZLE_MAP[name as DrizzleColumnTypes]?.({ node });
}
function createDrizzleColumnTypes(cb: CallbackDrizzleColumnType) {
  return cb;
}
