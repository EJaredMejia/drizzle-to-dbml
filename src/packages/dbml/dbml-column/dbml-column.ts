import type {
  DBMLAddPropertyParams,
  DBMLColumnPropertiesStatic,
  DBMLColumnProperty,
  DBMLColumnType,
} from "./types/dbml-column.types";

type ExcludeStaticProperties = Exclude<DBMLAddPropertyParams, DBMLColumnPropertiesStatic>;
type PropertyKeys = ExcludeStaticProperties["key"];

// Helper to get the value type for a given key from the DBMLAddPropertyParams union
type ValueForKey<K extends PropertyKeys> = Extract<ExcludeStaticProperties, { key: K }>;

export class DBMLColumn {
  columnName: string;
  private columnType: DBMLColumnType;
  private columnProperties: DBMLColumnProperty[];

  constructor() {
    this.columnName = "";
    // ! Default columnt type
    this.columnType = "int";
    this.columnProperties = [];
  }

  private static addPropertyValueMap: {
    [K in PropertyKeys]: (property: ValueForKey<K>) => string;
  } = {
    default: (property) => {
      const { value } = property;
      const formatProperty = typeof value === "string" ? `"${value}"` : value;

      return `${formatProperty}`;
    },
    note: (property) => {
      return `${property.value}`;
    },
  };

  private static getPropertyValue<T extends PropertyKeys>(property: ValueForKey<T>) {
    const key = property.key;

    const addProperty = DBMLColumn.addPropertyValueMap[key];

    return addProperty(property);
  }

  property(property: DBMLAddPropertyParams) {
    if (typeof property === "string") {
      this.columnProperties.push(property);
      return this;
    }

    const propertyToAdd = DBMLColumn.getPropertyValue(property);

    this.columnProperties.push(`${property.key}: ${propertyToAdd}`);

    return this;
  }

  column(columnName: string) {
    this.columnName = columnName;
    return this;
  }

  type(columnType: DBMLColumnType) {
    this.columnType = columnType;
    return this;
  }

  toString() {
    const columnProperties = this.columnProperties;
    return `${this.columnName} ${this.columnType}${columnProperties.length > 0 ? ` [${this.columnProperties.join(", ")}]` : ""}`;
  }
}
