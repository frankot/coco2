import { getOrigin } from "./get-origin";

async function createTransporter() {
  const nodemailer = await import("nodemailer");

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  const options: any = {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };

  return nodemailer.default.createTransport(options);
}

export async function sendMail({
  to,
  subject,
  html,
  text,
  from,
  attachments,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  attachments?: any[];
}) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.log("SMTP not configured, skipping email to", to);
    return false;
  }
  const sender =
    from ||
    process.env.FROM_EMAIL ||
    `no-reply@${getOrigin().replace(/^https?:\/\//, "")}` ||
    "no-reply@example.com";
  try {
    await transporter.sendMail({ from: sender, to, subject, html, text, attachments });
    console.log("Sent email to", to, "subject=", subject);
    return true;
  } catch (e) {
    console.error("Failed to send email to", to, e);
    return false;
  }
}

export default { sendMail };
