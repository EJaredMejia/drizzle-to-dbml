import { DBMLRelation } from "./dbml-relations/dbml-relations";
import { DBMLTable } from "./dbml-table/dbml-table";

export function createDBML() {
  return new DBML();
}

export class DBML {
  private tables: string[];
  private relations: string[];

  constructor() {
    this.tables = [];
    this.relations = [];
  }

  addTable(tableName: string, cb: (table: DBMLTable) => void) {
    const table = new DBMLTable(tableName);
    cb(table);
    this.tables.push(table.toString());

    return this;
  }

  addRelation(cb: (relation: DBMLRelation) => void) {
    const relation = new DBMLRelation();
    cb(relation);
    this.relations.push(relation.toString());

    return this;
  }

  toString() {
    return `${this.tables.join("\n\n")}\n\n${this.relations.join("\n\n")}`;
  }
}
