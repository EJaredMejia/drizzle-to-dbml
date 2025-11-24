import type { DBMLAddIndexProperty, DBMLIndexProperty } from "./types/dbml-indexes.types";

export class DBMLIndex {
  private columns: string[];
  private indexProperties: DBMLIndexProperty[];

  constructor() {
    this.columns = [];
    this.indexProperties = [];
  }

  column(column: string) {
    this.columns.push(column);

    return this;
  }

  property(property: DBMLAddIndexProperty) {
    if (typeof property === "string") {
      this.indexProperties.push(property);
      return this;
    }

    this.indexProperties.push(`${property.key}: "${property.value}"`);

    return this;
  }

  toString() {
    return `(${this.columns.join(", ")}) [${this.indexProperties.join(", ")}]`;
  }
}
