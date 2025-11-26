import { db } from "./db";
import { employees } from "@shared/schema";
import { eq } from "drizzle-orm";

import type { Employee, InsertEmployee } from "@shared/schema";

// Define storage interface
export interface IStorage {
  getEmployeeById(id: number): Promise<Employee | undefined>;
  getEmployeeByEmpcode(empcode: string): Promise<Employee | undefined>;
  createEmployee(emp: InsertEmployee): Promise<Employee>;
}

export class PgStorage implements IStorage {

  async getEmployeeById(id: number): Promise<Employee | undefined> {
    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id));

    return result[0];
  }

  async getEmployeeByEmpcode(empcode: string): Promise<Employee | undefined> {
    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.email, empcode)); 
      // NOTE: changed "empcode" → "email"
      // because your employees table DOES NOT contain an "empcode" column.
      // It contains: id, name, email, password, role

    return result[0];
  }

  async createEmployee(emp: InsertEmployee): Promise<Employee> {
    const result = await db
      .insert(employees)
      .values(emp)
      .returning();

    return result[0];
  }
}

// Export active storage
export const storage = new PgStorage();
