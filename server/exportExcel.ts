// server/exportExcel.ts
import { Router, Request, Response } from "express";
import { db } from "./db";
import { employees, projects, work_logs, time_entries } from "@shared/schema";
import path from "path";
import fs from "fs";
import { generateExcel } from "./utils/excel.js";
import { sendExcelEmail } from "./utils/sendEmail.js";

const router = Router();

/* ============================
   DOWNLOAD EXCEL
============================ */
router.get(
  "/export/excel/:table",
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { table } = req.params;
      let data: any[] = [];

      switch (table) {
        case "employees":
          data = await db.select().from(employees);
          break;
        case "projects":
          data = await db.select().from(projects);
          break;
        case "work_logs":
          data = await db.select().from(work_logs);
          break;
        case "time_entries":
          data = await db.select().from(time_entries);
          break;
        default:
          return res.status(400).json({ message: "Invalid table name" });
      }

      const filePath = path.join(process.cwd(), "report.xlsx");

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await generateExcel(data, filePath);

      if (!fs.existsSync(filePath)) {
        return res.status(500).json({ message: "Excel generation failed" });
      }

      return res.download(filePath);
    } catch (error) {
      console.error("Excel Export Error:", error);
      return res.status(500).json({ message: "Export error" });
    }
  }
);

/* ============================
   SEND EXCEL EMAIL
============================ */
router.post(
  "/export/send-email",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const data = await db.select().from(work_logs);
      const filePath = path.join(process.cwd(), "report.xlsx");

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await generateExcel(data, filePath);

      if (!fs.existsSync(filePath)) {
        return res.status(500).json({ message: "Excel generation failed" });
      }

      const success = await sendExcelEmail(email, filePath);

      if (!success) {
        return res.status(500).json({ message: "Email sending failed" });
      }

      return res.json({
        success: true,
        message: "Excel emailed successfully!",
      });
    } catch (error) {
      console.error("Email Excel Error:", error);
      return res.status(500).json({ message: "Email error" });
    }
  }
);

export default router;
