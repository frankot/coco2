import { readFile } from "node:fs/promises";
import { Resend } from "resend";
import { getOrigin } from "./get-origin";

type MailAttachment = {
  filename: string;
  content?: string | Buffer;
  path?: string;
};

type SendMailArgs = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  attachments?: MailAttachment[];
};

function createClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) return null;

  return new Resend(apiKey);
}

async function normalizeAttachments(attachments?: MailAttachment[]) {
  if (!attachments?.length) return undefined;

  const normalized = await Promise.all(
    attachments.map(async (attachment) => {
      if (attachment.path?.startsWith("http://") || attachment.path?.startsWith("https://")) {
        return {
          filename: attachment.filename,
          path: attachment.path,
        };
      }

      if (attachment.path) {
        const content = await readFile(attachment.path);

        return {
          filename: attachment.filename,
          content: content.toString("base64"),
        };
      }

      if (attachment.content) {
        const content = Buffer.isBuffer(attachment.content)
          ? attachment.content.toString("base64")
          : Buffer.from(attachment.content).toString("base64");

        return {
          filename: attachment.filename,
          content,
        };
      }

      return null;
    })
  );

  return normalized.filter((attachment): attachment is NonNullable<(typeof normalized)[number]> => Boolean(attachment));
}

export async function sendMail({ to, subject, html, text, from, attachments }: SendMailArgs) {
  const resend = createClient();

  if (!resend) {
    console.log("RESEND_API_KEY not configured, skipping email to", to);
    return false;
  }

  const sender =
    from ||
    process.env.FROM_EMAIL ||
    `no-reply@${getOrigin().replace(/^https?:\/\//, "")}` ||
    "no-reply@example.com";

  try {
    const normalizedAttachments = await normalizeAttachments(attachments);
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [to],
      subject,
      html: html ?? "",
      ...(text ? { text } : {}),
      ...(normalizedAttachments ? { attachments: normalizedAttachments } : {}),
    });

    if (error) {
      console.error("Failed to send email to", to, error);
      return false;
    }

    console.log("Sent email to", to, "subject=", subject, "id=", data?.id);
    return true;
  } catch (e) {
    console.error("Failed to send email to", to, e);
    return false;
  }
}

export default { sendMail };
