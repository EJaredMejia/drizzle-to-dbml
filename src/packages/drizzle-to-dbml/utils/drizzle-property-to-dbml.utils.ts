import type { DBMLAddPropertyParams } from "@/packages/dbml/dbml-column/types/dbml-column.types";
import type { CallExpression } from "acorn";
import type { DRIZZLE_COLUMN_PROPERTIES } from "../constants/drizzle-to-dbml.constants";

type DrizzleColumnProperties =
  (typeof DRIZZLE_COLUMN_PROPERTIES)[keyof typeof DRIZZLE_COLUMN_PROPERTIES];

interface DrizzlePropertiesCallbackParams {
  node: CallExpression;
}
type CallbackDrizzleColumnProperty = (
  params: DrizzlePropertiesCallbackParams,
) => DBMLAddPropertyParams;

export function createDrizzleColumnPropertyToDBML(cb: CallbackDrizzleColumnProperty) {
  return cb;
}

export const DRIZZLE_COLUMN_PROPERTY_DBLM_MAP = {
  default: createDrizzleColumnPropertyToDBML(({ node }) => {
    const value = node.arguments[0];

    const defaultValue = value.type === "Literal" ? value.value : "";

    return { key: "default", value: defaultValue as string };
  }),
  notNull: createDrizzleColumnPropertyToDBML(() => {
    return "not null";
  }),
  primaryKey: createDrizzleColumnPropertyToDBML(() => {
    return "pk";
  }),
  unique: createDrizzleColumnPropertyToDBML(() => {
    return "unique";
  }),
} as const satisfies Record<DrizzleColumnProperties, CallbackDrizzleColumnProperty>;

interface GetDrizzleColumnPropertyToDBMLParams extends DrizzlePropertiesCallbackParams {
  name: string;
}

export function getDrizzleColumnPropertyToDBML({
  name,
  node,
}: GetDrizzleColumnPropertyToDBMLParams): DBMLAddPropertyParams | undefined {
  return DRIZZLE_COLUMN_PROPERTY_DBLM_MAP[name as DrizzleColumnProperties]?.({
    node,
  });
}
