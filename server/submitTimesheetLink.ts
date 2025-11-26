// server/submitTimesheetLink.ts
import { Router, Request, Response } from "express";
import { Resend } from "resend";

const router = Router();

router.post("/submit-timesheet-link", async (req: Request, res: Response) => {
  try {
    const { employeeName, employeeId, date, shift, tasks } = req.body;

    // Validation
    if (!employeeName || !employeeId || !date || !shift || !tasks) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields!" });
    }

    // IMPORTANT - use your system IP
    const SERVER_IP = "http://192.168.1.11:5000";

    const link = `${SERVER_IP}/timesheet/${employeeId}/${date}`;

    // -------------------------
    // FORMAT TASKS LIST
    // -------------------------
    const tasksText = tasks
      .map((t: any, i: number) => {
        const entries = t.timeEntries
          .map((e: any, idx: number) => {
            const start = new Date(e.startTime).toLocaleString("en-IN");
            const end = new Date(e.endTime).toLocaleString("en-IN");
            return `        ${idx + 1}. ${start} → ${end}`;
          })
          .join("\n");

        return `
Task ${i + 1}
------------------------------
Project: ${t.project}
Title: ${t.title}
Description: ${t.description || "No description provided"}
Tools: ${t.tools?.join(", ") || "None"}
Completion: ${t.completionPercent || 0}%

Time Entries:
${entries}
`;
      })
      .join("\n");

    // -------------------------
    // RESEND SETUP
    // -------------------------
    const resend = new Resend(process.env.RESEND_API_KEY!);

    // -------------------------
    // SEND EMAIL
    // -------------------------
    await resend.emails.send({
      from: "onboarding@resend.dev", // MUST BE THIS
      to: ["srsuji13@gmail.com", "rajesh@ctint.in"], // add more if needed
      subject: `Timesheet - ${employeeName} (${employeeId})`,
      html: `
      <h2>Timesheet Submitted</h2>

      <p><b>Name:</b> ${employeeName}</p>
      <p><b>Employee ID:</b> ${employeeId}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Shift:</b> ${shift}</p>

      <hr/>
      <h3>Task Details</h3>
      <pre style="background:#f5f5f5;padding:10px;border-radius:6px;">
${tasksText}
      </pre>

      <hr/>
      <p><b>View Full Timesheet:</b></p>
      <a href="${link}" style="font-size:16px;color:#0066ff;">
        ${link}
      </a>

      <br/><br/>
      <p>Regards,<br/>Timesheet System</p>
    `,
    });

    return res.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

export default router;
