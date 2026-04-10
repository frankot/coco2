import { getOrigin } from "@/lib/get-origin";

// Shared email layout
export function renderEmailLayout(args: {
  title: string;
  intro: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const siteUrl = getOrigin();

  return `
    <div style="margin:0;background:#f7fdf8;padding:28px 12px;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#0d160f;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #c5e8ea;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(110deg,#e0f5f6,#c5e8ea);padding:22px 24px;text-align:center;">
          <img src="${siteUrl}/logo.png" alt="Logo" style="height:54px;object-fit:contain;" onerror="this.style.display='none'" />
        </div>
        <div style="padding:24px;">
          <h1 style="margin:0 0 8px;font-size:24px;line-height:1.25;color:#0d160f;">${args.title}</h1>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#2b6a4b;">${args.intro}</p>
          ${args.body}
          ${
            args.ctaLabel && args.ctaHref
              ? `<div style="margin:20px 0 4px;"><a href="${args.ctaHref}" style="display:inline-block;background:#76c3c5;color:#000000;text-decoration:none;padding:10px 20px;border-radius:9px;font-weight:600;">${args.ctaLabel}</a></div>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}
