import { Resend } from "resend";
import fs from "fs";

export async function sendExcelEmail(
  to: string,
  filePath: string
): Promise<boolean> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const file = fs.readFileSync(filePath);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@resend.dev",
      to,
      subject: "Timesheet Excel Report",
      text: "Your Excel report is attached.",
      attachments: [
        {
          filename: "report.xlsx",
          content: file,
        },
      ],
    });

    return true; // ⭐ MUST RETURN BOOLEAN
  } catch (error) {
    console.error("Resend Email Error:", error);
    return false; // ⭐ MUST RETURN BOOLEAN
  }
}
