import type { DBMLTableRelationsId } from "./types/dbml-relations.types";

export class DBMLRelation {
  private column1: string[];
  private table1: string;
  private table2: string;
  private column2: string[];
  private relationType: DBMLTableRelationsId;

  constructor() {
    this.column1 = [];
    this.table1 = "";
    this.table2 = "";
    this.column2 = [];
    this.relationType = ">";
  }

  setTable1(table1: string) {
    this.table1 = table1;
    return this;
  }

  setTable2(table2: string) {
    this.table2 = table2;
    return this;
  }

  addColumn1(column1: string) {
    this.column1.push(column1);
    return this;
  }

  addColumn2(column2: string) {
    this.column2.push(column2);
    return this;
  }

  setRelationType(relationType: DBMLTableRelationsId) {
    this.relationType = relationType;
    return this;
  }

  private getColumnStrings(table: string, column: string[]) {
    const columns = column.length === 1 ? column[0] : `(${column.join(",")})`;

    return `${table}.${columns}`;
  }
  toString() {
    const column1 = this.getColumnStrings(this.table1, this.column1);
    const columns2 = this.getColumnStrings(this.table2, this.column2);
    return `Ref ${this.table1}_${this.table2}: ${column1} ${this.relationType} ${columns2}`;
  }
}
