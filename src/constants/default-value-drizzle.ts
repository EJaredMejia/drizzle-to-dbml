export const defaultDrizzleSchema = `import {
  foreignKey,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey().notNull(),
    username: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 255 }).default("normal").notNull(),
    status: varchar({ length: 255 }).default("active").notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [unique("users_email_key").on(table.email)]
);

export const carts = pgTable(
  "carts",
  {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    status: varchar({ length: 255 }).default("active").notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "carts_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const orders = pgTable(
  "orders",
  {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    cartId: integer().notNull(),
    totalPrice: numeric().notNull(),
    status: varchar({ length: 255 }).default("active").notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.cartId],
      foreignColumns: [carts.id],
      name: "orders_cartId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "orders_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const products = pgTable(
  "products",
  {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    quantity: integer().notNull(),
    price: numeric().notNull(),
    categoryId: integer().notNull(),
    userId: integer().notNull(),
    status: varchar({ length: 255 }).default("active").notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "products_categoryId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "products_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const productImgs = pgTable(
  "productImgs",
  {
    id: serial().primaryKey().notNull(),
    imgUrl: varchar({ length: 255 }).notNull(),
    productId: integer().notNull(),
    status: varchar({ length: 255 }).default("active").notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "productImgs_productId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const productInCarts = pgTable(
  "productInCarts",
  {
    id: serial().primaryKey().notNull(),
    cartId: integer().notNull(),
    productId: integer().notNull(),
    quantity: integer().notNull(),
    newColumn: varchar({ length: 10 }).notNull(),
    status: varchar({ length: 255 }).default("active").notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.cartId],
      foreignColumns: [carts.id],
      name: "productInCarts_cartId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "productInCarts_productId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const categories = pgTable("categories", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 255 }).default("active").notNull(),
  createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
});
`;
