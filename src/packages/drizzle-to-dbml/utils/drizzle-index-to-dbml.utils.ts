import type { DBML } from "@/packages/dbml/dbml";
import type { DBMLIndex } from "@/packages/dbml/dbml-indexes/dbml-indexes";
import type { CallExpression, Expression } from "acorn";
import type { DRIZZLE_INDEXES } from "../constants/drizzle-to-dbml.constants";
import type { DBMLTable } from "@/packages/dbml/dbml-table/dbml-table";
import type { ColumnJsDbMap, JsToDBTablesMap } from "../types/drizzle-to-dbml.types";

type DrizzleIndexProperties = (typeof DRIZZLE_INDEXES)[keyof typeof DRIZZLE_INDEXES];

interface DrizzleIndexCallbackParams {
  node: CallExpression;
  dbml: DBML;
  table: DBMLTable;
  index: DBMLIndex;
  tableJsDbMap: JsToDBTablesMap;
  columnJsDbMap: ColumnJsDbMap;
}
type CallbackDrizzleIndex = (params: DrizzleIndexCallbackParams) => void;

export function createDrizzleIndexToDBML(cb: CallbackDrizzleIndex) {
  return cb;
}
function getLiteralParameterNode(node: CallExpression) {
  const indexName = node.arguments[0];

  if (indexName?.type === "Literal") {
    return String(indexName.value);
  }

  return "";
}
const unique = createDrizzleIndexToDBML(({ node, index }) => {
  const property = "unique";

  const indexName = getLiteralParameterNode(node);

  if (indexName) {
    index.property({ key: "name", value: indexName });
  }

  index.property(property);
});

export const DRIZZLE_INDEX_NAME_MAP = {
  unique,
  uniqueIndex: unique,
  index: createDrizzleIndexToDBML(({ node, index }) => {
    const indexName = getLiteralParameterNode(node);

    if (indexName) {
      index.property({ key: "name", value: indexName });
    }
  }),
  foreignKey: createDrizzleIndexToDBML(
    ({ dbml, node, index, table, columnJsDbMap, tableJsDbMap }) => {
      // console.log({ node });

      const foreignArgument = node.arguments[0];

      if (foreignArgument.type !== "ObjectExpression") {
        return;
      }

      dbml.addRelation((relation) => {
        relation.setRelationType(">");
        relation.setTable1(table.table);
        for (const property of foreignArgument.properties) {
          if (property.type !== "Property") {
            continue;
          }

          const keyName = property.key.type === "Identifier" ? property.key.name : "";

          if (keyName === "name" && property.value.type === "Literal") {
            index.property({
              key: "name",
              value: String(property.value.value),
            });
            continue;
          }

          parseColumnsForeignKey({
            node: property.value,
            onColumn: (column, i) => {
              if (keyName === "columns") {
                const columnDbName = columnJsDbMap.get(column.value) || column.value;
                index.column(columnDbName);
                relation.addColumn1(columnDbName);

                return;
              }

              if (keyName === "foreignColumns") {
                const columns2DbName = tableJsDbMap.get(column.property);

                const column2DbName = columns2DbName?.columns.get(column.value) || column.value;
                relation.addColumn2(column2DbName);

                if (i === 0) {
                  relation.setTable2(columns2DbName?.dbName || column.property);
                }
              }
            },
          });
        }
      });

      return;
    },
  ),
} as const satisfies Record<DrizzleIndexProperties, CallbackDrizzleIndex>;

interface GetDrizzleIndexToDBMLParams extends DrizzleIndexCallbackParams {
  name: string;
}

export function addDrizzleIndexProperty({ name, ...rest }: GetDrizzleIndexToDBMLParams) {
  return DRIZZLE_INDEX_NAME_MAP[name as DrizzleIndexProperties]?.(rest);
}

interface AddColumnsIndexParams {
  node: CallExpression;
  index: DBMLIndex;
  columnJsDbMap: ColumnJsDbMap;
}
export function addColumnsIndex({ node, index, columnJsDbMap }: AddColumnsIndexParams) {
  const callee = node.callee;
  if (callee.type !== "MemberExpression" || callee.property.type !== "Identifier") {
    return;
  }

  if (callee.property.name !== "on") {
    return;
  }

  for (const argument of node.arguments) {
    if (argument.type !== "MemberExpression" || argument.property.type !== "Identifier") {
      continue;
    }

    const jsColumnName = argument.property.name;
    const dbName = columnJsDbMap.get(jsColumnName);
    index.column(dbName || jsColumnName);
  }
}

interface ParseColumnsForeignKeyParams {
  node: Expression;
  onColumn: (column: { property: string; value: string }, index: number) => void;
}
function parseColumnsForeignKey({ node, onColumn }: ParseColumnsForeignKeyParams) {
  if (node.type !== "ArrayExpression") {
    return;
  }

  let index = 0;
  for (const element of node.elements) {
    if (element?.type !== "MemberExpression") {
      continue;
    }

    if (element.property.type !== "Identifier") {
      continue;
    }

    if (element.object.type !== "Identifier") {
      continue;
    }

    onColumn(
      {
        value: element.property.name,
        property: element.object.name,
      },
      index,
    );
    index++;
  }
}
