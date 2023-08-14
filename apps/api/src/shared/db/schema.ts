import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
  },
  (users) => {
    return {
      username_idx: uniqueIndex("username_idx").on(users.username)
    };
  }
);

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;
