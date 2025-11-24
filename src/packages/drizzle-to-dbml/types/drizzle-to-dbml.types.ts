export type ColumnJsDbMap = Map<string, string>;

export type JsToDBTablesMap = Map<
  string,
  {
    dbName: string;
    columns: ColumnJsDbMap;
  }
>;
