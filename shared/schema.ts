// shared/schema.ts
import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  date
} from "drizzle-orm/pg-core";

import { InferModel } from "drizzle-orm";

// employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  empcode: varchar("empcode", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
});

// ✔ Types generated correctly for storage.ts
export type Employee = InferModel<typeof employees>;
export type InsertEmployee = InferModel<typeof employees, "insert">;

// projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull().unique(),
  description: text("description"),
});

// work_logs table (stores employee tasks/day)
export const work_logs = pgTable("work_logs", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id").notNull(),
  project_id: integer("project_id"),
  task_name: varchar("task_name", { length: 255 }),
  tools_used: varchar("tools_used", { length: 1000 }),
  shift_type: varchar("shift_type", { length: 50 }),
  total_minutes: integer("total_minutes"),
  date: date("date").notNull(),
});

// time_entries table (start/end times per task)
export const time_entries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  worklog_id: integer("worklog_id").notNull(),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time").notNull(),
});
