import mailer from "@/lib/mailer";
import { getOrigin } from "@/lib/get-origin";
import { renderEmailLayout } from "@/lib/email-layout";

type EmailOrderItem = {
  quantity: number;
  pricePerItemInCents: number;
  product?: {
    name?: string | null;
  } | null;
};

type EmailOrderUser = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

type EmailOrder = {
  id: string;
  paymentMethod: "BANK_TRANSFER" | "COD" | "STRIPE";
  pricePaidInCents: number;
  subtotalInCents: number;
  shippingCostInCents: number;
  discountAmountInCents?: number | null;
  apaczkaTrackingUrl?: string | null;
  apaczkaWaybillNumber?: string | null;
  shippingServiceName?: string | null;
  accessToken?: string | null;
  user: EmailOrderUser;
  orderItems: EmailOrderItem[];
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(cents / 100);
}

function getCustomerName(user: EmailOrderUser) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.email;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paymentLabel(method: EmailOrder["paymentMethod"]) {
  if (method === "COD") return "Pobranie";
  if (method === "STRIPE") return "Płatność online";
  return "Przelew bankowy";
}

function renderOrderItems(items: EmailOrderItem[]) {
  const rows = items
    .map((item) => {
      const unit = formatCurrency(item.pricePerItemInCents);
      const line = formatCurrency(item.quantity * item.pricePerItemInCents);
      const name = escapeHtml(item.product?.name || "Produkt");

      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #c5e8ea;">${name}</td>
          <td style="padding:10px 0;border-bottom:1px solid #c5e8ea;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #c5e8ea;text-align:right;">${unit}</td>
          <td style="padding:10px 0;border-bottom:1px solid #c5e8ea;text-align:right;font-weight:600;">${line}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#0d160f;">
      <thead>
        <tr>
          <th align="left" style="padding:0 0 10px;border-bottom:1px solid #76c3c5;">Produkt</th>
          <th align="center" style="padding:0 0 10px;border-bottom:1px solid #76c3c5;">Ilość</th>
          <th align="right" style="padding:0 0 10px;border-bottom:1px solid #76c3c5;">Cena</th>
          <th align="right" style="padding:0 0 10px;border-bottom:1px solid #76c3c5;">Suma</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderSummary(order: EmailOrder) {
  const discount = Math.max(order.discountAmountInCents ?? 0, 0);

  return `
    <div style="background:#eef9f9;border:1px solid #76c3c5;border-radius:10px;padding:14px;margin:18px 0;">
      <div style="display:flex;justify-content:space-between;font-size:14px;color:#0d160f;margin-bottom:8px;">
        <span>Wartość produktów </span>
        <strong>${formatCurrency(order.subtotalInCents)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;color:#0d160f;margin-bottom:8px;">
        <span>Dostawa </span>
        <strong>${formatCurrency(order.shippingCostInCents)}</strong>
      </div>
      ${
        discount > 0
          ? `<div style="display:flex;justify-content:space-between;font-size:14px;color:#0d160f;margin-bottom:8px;"><span>Rabat</span><strong>-${formatCurrency(discount)}</strong></div>`
          : ""
      }
      <div style="display:flex;justify-content:space-between;font-size:16px;color:#0d160f;padding-top:8px;border-top:1px solid #76c3c5;font-weight:700;">
        <span>Do zapłaty </span>
        <strong>${formatCurrency(order.pricePaidInCents)}</strong>
      </div>
    </div>
  `;
}

// Re-export for backwards compat
const renderLayout = renderEmailLayout;

export async function sendOrderPlacedEmail(order: EmailOrder) {
  if (!order.user?.email) return false;

  const siteUrl = getOrigin().replace(/\/$/, "");
  const tokenParam = order.accessToken ? `&token=${encodeURIComponent(order.accessToken)}` : "";
  const orderUrl = `${siteUrl}/kasa/zlozone-zamowienie/${order.id}?payment=${order.paymentMethod}${tokenParam}`;
  const customerName = escapeHtml(getCustomerName(order.user));

  const body = `
    <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Cześć ${customerName}, dziękujemy za zakup. Poniżej znajdziesz podsumowanie zamówienia <strong style="font-family:ui-monospace,Menlo,Monaco,monospace;">${order.id}</strong>.</p>
    <div style="margin:16px 0;">${renderOrderItems(order.orderItems)}</div>
    ${renderSummary(order)}
    <p style="margin:0;font-size:14px;color:#2b6a4b;">Metoda płatności: <strong>${paymentLabel(order.paymentMethod)}</strong></p>
  `;

  return mailer.sendMail({
    to: order.user.email,
    subject: `Potwierdzenie zamówienia ${order.id}`,
    html: renderLayout({
      title: "Dziękujemy za zamówienie",
      intro: "Przyjęliśmy Twoje zamówienie i rozpoczynamy realizację.",
      body,
      ctaLabel: "Zobacz szczegóły zamówienia",
      ctaHref: orderUrl,
    }),
  });
}

export async function sendOrderProcessingEmail(order: EmailOrder) {
  if (!order.user?.email) return false;

  const trackingUrl = order.apaczkaTrackingUrl || `${getOrigin().replace(/\/$/, "")}/uzytkownik`;

  const body = `
    <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Zamówienie <strong style="font-family:ui-monospace,Menlo,Monaco,monospace;">${order.id}</strong> jest przygotowywane do wysyłki.</p>
    <div style="background:#eef9f9;border:1px solid #76c3c5;border-radius:10px;padding:14px;margin:0 0 14px;">
      <div style="font-size:14px;color:#0d160f;margin-bottom:6px;">Numer przesyłki: <strong>${order.apaczkaWaybillNumber || "w przygotowaniu"}</strong></div>
      <div style="font-size:14px;color:#0d160f;">Przewoźnik: <strong>${order.shippingServiceName || "Apaczka"}</strong></div>
    </div>
    <p style="margin:0;font-size:14px;color:#2b6a4b;">Po kliknięciu w przycisk możesz sprawdzić aktualny status przesyłki.</p>
  `;

  return mailer.sendMail({
    to: order.user.email,
    subject: `Przygotowujemy Twoje zamówienie ${order.id}`,
    html: renderLayout({
      title: "Zamówienie w przygotowaniu",
      intro: "Przekazujemy paczkę do realizacji i wkrótce ruszy w drogę.",
      body,
      ctaLabel: "Śledź przesyłkę",
      ctaHref: trackingUrl,
    }),
  });
}

export async function sendOrderShippedEmail(order: EmailOrder) {
  if (!order.user?.email) return false;

  const trackingUrl = order.apaczkaTrackingUrl || `${getOrigin().replace(/\/$/, "")}/uzytkownik`;

  const body = `
    <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Twoje zamówienie <strong style="font-family:ui-monospace,Menlo,Monaco,monospace;">${order.id}</strong> zostało wysłane.</p>
    <div style="background:#eef9f9;border:1px solid #76c3c5;border-radius:10px;padding:14px;margin:0 0 14px;">
      <div style="font-size:14px;color:#0d160f;margin-bottom:6px;">Numer przesyłki: <strong>${order.apaczkaWaybillNumber || "-"}</strong></div>
      <div style="font-size:14px;color:#0d160f;">Przewoźnik: <strong>${order.shippingServiceName || "Apaczka"}</strong></div>
    </div>
    <p style="margin:0;font-size:14px;color:#2b6a4b;">Kliknij poniżej, aby sprawdzić gdzie jest Twoja paczka.</p>
  `;

  return mailer.sendMail({
    to: order.user.email,
    subject: `Zamówienie ${order.id} zostało wysłane`,
    html: renderLayout({
      title: "Paczka jest w drodze",
      intro: "Przekazaliśmy przesyłkę kurierowi.",
      body,
      ctaLabel: "Sprawdź status przesyłki",
      ctaHref: trackingUrl,
    }),
  });
}
