import type { Express, Request, Response } from "express";
import { db } from "./db";
import { employees } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerAuthRoutes(app: Express) {

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { employeeId, employeeName } = req.body;

    if (!employeeId || !employeeName) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and Name are required",
      });
    }

    try {
      // 🔥 MATCHES DATABASE COLUMN `empcode`
      const result = await db
        .select()
        .from(employees)
        .where(eq(employees.empcode, employeeId));

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Employee ID not found",
        });
      }

      const emp = result[0];

      // 🔥 MATCHES DATABASE COLUMN `name`
      if (emp.name.toLowerCase() !== employeeName.toLowerCase()) {
        return res.status(401).json({
          success: false,
          message: "Employee name does not match",
        });
      }

      return res.json({
        success: true,
        message: "Login successful",
        employee: {
          employeeId: emp.empcode,
          employeeName: emp.name,
        },
      });

    } catch (error) {
      console.error("Auth Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  });

}
