import type { Express, Request, Response } from "express";
import { db } from "./db";
import { work_logs, time_entries } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Register all /api/tasks routes
 */
export function registerTaskRoutes(app: Express) {

  // Save work log (task)
  app.post("/api/tasks/task", async (req: Request, res: Response) => {
    const {
      employee_id,
      project_id,
      task_name,
      tools_used,
      shift_type,
      total_minutes,
      date
    } = req.body;

    try {
      await db.insert(work_logs).values({
        employee_id,
        project_id,
        task_name,
        tools_used,
        shift_type,
        total_minutes,
        date,
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Work Log Insert Error:", err);
      res.status(500).json({ success: false, error: "Work log insert failed" });
    }
  });

  // Save time entry
  app.post("/api/tasks/time-entry", async (req: Request, res: Response) => {
    const { worklog_id, start_time, end_time } = req.body;

    try {
      await db.insert(time_entries).values({
        worklog_id,
        start_time,
        end_time,
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Time Entry Error:", err);
      res.status(500).json({ success: false, error: "Time entry insert failed" });
    }
  });

  // Get all tasks (work logs) for an employee
  app.get("/api/tasks/:employee_id", async (req: Request, res: Response) => {
    const { employee_id } = req.params;

    try {
      const result = await db
        .select()
        .from(work_logs)
        .where(eq(work_logs.employee_id, Number(employee_id)));

      res.json({ success: true, tasks: result });
    } catch (err) {
      console.error("Task Fetch Error:", err);
      res.status(500).json({ success: false });
    }
  });
}
