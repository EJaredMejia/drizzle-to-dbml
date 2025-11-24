import { DBMLColumn } from "@/packages/dbml/dbml-column/dbml-column";
import { DBMLIndex } from "../dbml-indexes/dbml-indexes";

const DEFAULT_INDENT = 4;

export class DBMLTable {
  private tableName: string;
  private columns: string[];
  private indexes: string[];

  constructor(tableName: string) {
    this.tableName = tableName;
    this.columns = [];
    this.indexes = [];
  }

  get table() {
    return this.tableName;
  }

  addColumn(cb: (column: DBMLColumn) => void) {
    const column = new DBMLColumn();
    cb(column);

    this.columns.push(column.toString());
    return this;
  }

  addIndex(cb: (index: DBMLIndex) => void) {
    const index = new DBMLIndex();
    cb(index);
    this.indexes.push(index.toString());

    return this;
  }

  toString() {
    const indexes = this.indexes;
    return `Table ${this.tableName} {
  ${this.columns.join("\n  ")}
  ${
    indexes.length > 0
      ? `
  Indexes {
    ${indexes.join(`\n${" ".repeat(DEFAULT_INDENT)}`)}
  }`
      : ""
  }
}`;
  }
}
