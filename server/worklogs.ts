import { type Express, type Request, type Response } from "express";
import { db } from "./db";
import { employees, work_logs, time_entries } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerWorklogRoutes(app: Express) {

  /* ======================================================
     1. CREATE WORKLOG  (supports /api/worklogs)
     ====================================================== */
  app.post("/api/worklogs", async (req: Request, res: Response) => {
    try {
      const {
        employeeEmpcode,
        project,
        title,
        description,
        tools,
        timeEntries,
        shiftType,
        date    // already string "YYYY-MM-DD"
      } = req.body;

      console.log("Incoming Worklog:", req.body);

      /* ⭐ STEP 1 — Convert EMP CODE → employee.id */
      const employeeRow = await db
        .select()
        .from(employees)
        .where(eq(employees.empcode, employeeEmpcode));

      if (employeeRow.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee code: " + employeeEmpcode
        });
      }

      const employee_id = employeeRow[0].id;

      /* ⭐ STEP 2 — Calculate total minutes */
      let totalMinutes = 0;
      if (Array.isArray(timeEntries)) {
        timeEntries.forEach(entry => {
          const diff =
            (new Date(entry.endTime).getTime() -
             new Date(entry.startTime).getTime()) / 1000;
          totalMinutes += Math.floor(diff / 60);
        });
      }

      /* ⭐ STEP 3 — Insert work log */
      const inserted = await db
        .insert(work_logs)
        .values({
          employee_id,
          project_id: null,
          task_name: title,
          tools_used: tools?.join(", ") ?? "",
          shift_type: shiftType,
          total_minutes: totalMinutes,

          // ⛔ FIX — Drizzle wants a string, NOT a Date object
          date: date  
        })
        .returning({ id: work_logs.id });

      const worklogId = inserted[0].id;

      /* ⭐ STEP 4 — Insert time entries */
      if (Array.isArray(timeEntries)) {
        for (const entry of timeEntries) {
          await db.insert(time_entries).values({
            worklog_id: worklogId,

            // these require Date objects
            start_time: new Date(entry.startTime),
            end_time: new Date(entry.endTime),
          });
        }
      }

      return res.json({ success: true, worklogId });

    } catch (error) {
      console.error("Worklog Insert Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save work log"
      });
    }
  });

  /* ======================================================
     2. OLD ROUTE (still works)
     ====================================================== */
  app.post("/api/worklogs/save", async (req: Request, res: Response) => {
    try {
      const {
        employeeId,
        projectId,
        taskName,
        toolsUsed,
        shiftType,
        totalMinutes,
        date // string
      } = req.body;

      const inserted = await db
        .insert(work_logs)
        .values({
          employee_id: employeeId,
          project_id: projectId ?? null,
          task_name: taskName,
          tools_used: toolsUsed,
          shift_type: shiftType,
          total_minutes: totalMinutes,
          date: date  // ⛔ FIX
        })
        .returning({ id: work_logs.id });

      return res.json({
        success: true,
        worklogId: inserted[0].id
      });

    } catch (error) {
      console.error("Worklog Insert Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save work log"
      });
    }
  });

  /* ======================================================
     3. GET ALL WORKLOGS
     ====================================================== */
  app.get("/api/worklogs", async (_req: Request, res: Response) => {
    try {
      const logs = await db.select().from(work_logs);
      return res.json(logs);
    } catch (error) {
      console.error("Fetch Logs Error:", error);
      return res.status(500).json({ message: "Failed to fetch logs" });
    }
  });

  /* ======================================================
     4. GET WORKLOGS BY EMPLOYEE
     ====================================================== */
  app.get("/api/worklogs/:employeeId", async (req: Request, res: Response) => {
    const { employeeId } = req.params;

    try {
      const logs = await db
        .select()
        .from(work_logs)
        .where(eq(work_logs.employee_id, Number(employeeId)));

      return res.json({ success: true, logs });

    } catch (error) {
      console.error("Fetch Logs Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch logs",
      });
    }
  });

}
