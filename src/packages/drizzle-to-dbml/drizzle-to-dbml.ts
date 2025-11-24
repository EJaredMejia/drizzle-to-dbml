import type { ArrowFunctionExpression, CallExpression, ObjectExpression } from "acorn";
import { parse } from "acorn";
import { simple } from "acorn-walk";
import { createDBML, type DBML } from "../dbml/dbml";
import type { DBMLColumn } from "../dbml/dbml-column/dbml-column";
import type { DBMLTable } from "../dbml/dbml-table/dbml-table";
import { drizzleDeclarationTables } from "./constants/drizzle-to-dbml.constants";
import { getDBMLColumnDrizzleType } from "./utils/drizzle-column-to-dbml.utils";
import { getDrizzleColumnPropertyToDBML } from "./utils/drizzle-property-to-dbml.utils";
import type { DBMLIndex } from "../dbml/dbml-indexes/dbml-indexes";
import { addColumnsIndex, addDrizzleIndexProperty } from "./utils/drizzle-index-to-dbml.utils";
import type { ColumnJsDbMap, JsToDBTablesMap } from "./types/drizzle-to-dbml.types";

export function parseDrizzle(code: string) {
  const dbml = createDBML();
  const tableJsDbMap: JsToDBTablesMap = new Map();

  const ast = parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
  });

  // need to get declaration and callexpression param
  simple(ast, {
    VariableDeclarator(node) {
      const initNode = node.init;

      if (!initNode || initNode.type !== "CallExpression") {
        return;
      }

      const jsName = node.id.type === "Identifier" ? node.id.name : "";

      if (!("name" in initNode.callee)) {
        return;
      }

      const { name } = initNode.callee;

      if (!drizzleDeclarationTables.has(name)) {
        return;
      }

      const tableArg = initNode.arguments[0];
      const tableName = tableArg.type === "Literal" ? String(tableArg.value) : "";

      const columnArg =
        initNode.arguments[1].type === "ObjectExpression" ? initNode.arguments[1] : null;

      const columnJsDbMap: ColumnJsDbMap = new Map();
      dbml.addTable(tableName, (table) => {
        if (columnArg) {
          parseColumns({
            node: columnArg,
            table,
            columnJsDbMap,
          });
        }

        tableJsDbMap.set(jsName, {
          dbName: tableName,
          columns: columnJsDbMap,
        });

        const indexes =
          initNode.arguments[2]?.type === "ArrowFunctionExpression" ? initNode.arguments[2] : null;

        if (indexes) {
          parseIndexes({
            node: indexes,
            table,
            dbml,
            columnJsDbMap,
            tableJsDbMap,
          });
        }
      });
    },
  });

  return dbml.toString();
}

interface ParseColumnsParams {
  node: ObjectExpression;
  table: DBMLTable;
  columnJsDbMap: ColumnJsDbMap;
}
function parseColumns({ node, table, columnJsDbMap }: ParseColumnsParams) {
  for (const property of node.properties) {
    if (property.type !== "Property") {
      return;
    }

    const key = property.key;

    if (key.type !== "Identifier") {
      return;
    }

    table.addColumn((column) => {
      simple(property.value, {
        CallExpression(node) {
          parseColumnProperties({
            column,
            node,
            columnJsDbMap,
            jsColumnName: key.name,
          });
        },
      });
    });
  }
}

interface ParseColumnPropertiesParams {
  node: CallExpression;
  column: DBMLColumn;
  columnJsDbMap: ColumnJsDbMap;
  jsColumnName: string;
}
function parseColumnProperties({
  node,
  column,
  columnJsDbMap,
  jsColumnName,
}: ParseColumnPropertiesParams) {
  const callee = node.callee;

  //! column type
  if (callee.type === "Identifier") {
    const firstArgument = node.arguments[0];

    let dbColumnName = jsColumnName;
    if (
      firstArgument &&
      firstArgument.type === "Literal" &&
      typeof firstArgument.value === "string"
    ) {
      dbColumnName = firstArgument.value;
    }

    column.column(dbColumnName);
    columnJsDbMap.set(jsColumnName, dbColumnName);

    const dbmlType = getDBMLColumnDrizzleType({
      name: callee.name,
      node,
    });

    if (!dbmlType) {
      return;
    }

    if (dbmlType === "serial") {
      column.property("increment");
    }

    column.type(dbmlType);
    return;
  }

  // !column properties
  if (callee.type === "MemberExpression") {
    const property = callee.property;
    const name = property.type === "Identifier" ? property.name : "";
    const dbmlProperty = getDrizzleColumnPropertyToDBML({
      name,
      node,
    });

    if (!dbmlProperty) {
      return;
    }

    column.property(dbmlProperty);

    return;
  }

  return;
}

interface ParseIndexesParams {
  node: ArrowFunctionExpression;
  table: DBMLTable;
  dbml: DBML;
  columnJsDbMap: ColumnJsDbMap;
  tableJsDbMap: JsToDBTablesMap;
}
function parseIndexes({ node, table, dbml, columnJsDbMap, tableJsDbMap }: ParseIndexesParams) {
  const elements = node.body.type === "ArrayExpression" ? node.body.elements : [];

  for (const element of elements) {
    if (!element) {
      continue;
    }
    if (element.type !== "CallExpression") {
      continue;
    }
    table.addIndex((index) => {
      simple(element, {
        CallExpression(node) {
          parseIndex({ node, dbml, index, table, columnJsDbMap, tableJsDbMap });
        },
      });
    });
  }
}

interface ParseIndexParams {
  node: CallExpression;
  dbml: DBML;
  index: DBMLIndex;
  table: DBMLTable;
  columnJsDbMap: ColumnJsDbMap;
  tableJsDbMap: JsToDBTablesMap;
}
function parseIndex({ node, dbml, index, table, columnJsDbMap, tableJsDbMap }: ParseIndexParams) {
  const callee = node.callee;

  if (callee.type === "Identifier") {
    addDrizzleIndexProperty({
      name: callee.name,
      node,
      index,
      dbml,
      table,
      columnJsDbMap,
      tableJsDbMap,
    });

    return;
  }

  addColumnsIndex({
    node,
    index,
    columnJsDbMap,
  });
}
