export type DBMLIndexPropertyStatic = "pk" | "unique";
export type DBMLIndexProperty = DBMLIndexPropertyStatic | `name: ${string}`;
export type DBMLIndexPropertyDynamic = { key: "name"; value: string };

export type DBMLAddIndexProperty = DBMLIndexPropertyStatic | DBMLIndexPropertyDynamic;
