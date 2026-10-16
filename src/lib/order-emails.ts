import mailer from "@/lib/mailer";
import { getOrigin } from "@/lib/get-origin";
import { renderEmailLayout } from "@/lib/email-layout";
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents";
import path from "node:path";

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
  paymentMethod: "BANK_TRANSFER" | "COD" | "STRIPE" | "INVOICE_DEFERRED";
  pricePaidInCents: number;
  subtotalInCents: number;
  shippingCostInCents: number;
  discountAmountInCents?: number | null;
  apaczkaTrackingUrl?: string | null;
  apaczkaWaybillNumber?: string | null;
  shippingServiceName?: string | null;
  accessToken?: string | null;
  isB2BManual?: boolean | null;
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
  if (method === "INVOICE_DEFERRED") return "Faktura z odroczonym terminem płatności";
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
  const shippingLine = order.isB2BManual
    ? `<span>Dostawa </span><strong>Dostawa firmowa</strong>`
    : `<span>Dostawa </span><strong>${formatCurrency(order.shippingCostInCents)}</strong>`;

  return `
    <div style="background:#eef9f9;border:1px solid #76c3c5;border-radius:10px;padding:14px;margin:18px 0;">
      <div style="display:flex;justify-content:space-between;font-size:14px;color:#0d160f;margin-bottom:8px;">
        <span>Wartość produktów </span>
        <strong>${formatCurrency(order.subtotalInCents)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;color:#0d160f;margin-bottom:8px;">
        ${shippingLine}
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

// Withdrawal Notice (durable medium)
function renderWithdrawalNotice() {
  const p = 'style="margin:0 0 10px;font-size:13px;line-height:1.5;color:#0d160f;"';
  return `
    <div style="border-top:1px solid #c5e8ea;margin-top:24px;padding-top:16px;">
      <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#0d160f;">Pouczenie o prawie odstąpienia od umowy</p>
      <p ${p}>Jeśli kupujesz jako konsument (lub przedsiębiorca na prawach konsumenta), możesz odstąpić od umowy w terminie 14 dni bez podawania przyczyny. Termin biegnie od otrzymania towaru przez Ciebie lub wskazaną przez Ciebie osobę inną niż przewoźnik, a przy dostawie w częściach od otrzymania ostatniej części.</p>
      <p ${p}>Aby odstąpić od umowy, wyślij jednoznaczne oświadczenie e-mailem na <strong>kontakt@drcoco.pl</strong> lub listownie na adres: NEW AGE FOOD sp. z o.o., ul. Modlińska 29a, 05-110 Jabłonna. Możesz skorzystać z załączonego formularza odstąpienia, ale nie jest to obowiązkowe. Do zachowania terminu wystarczy wysłanie oświadczenia przed jego upływem.</p>
      <p ${p}>Towar odeślij niezwłocznie, najpóźniej w ciągu 14 dni od odstąpienia, na adres zwrotów: <strong>NEW AGE FOOD sp. z o.o., ul. Różana 1a, 07-230 Gaj</strong>. Bezpośredni koszt odesłania ponosisz Ty.</p>
      <p ${p}>Zwrócimy wszystkie należne płatności, w tym koszt dostawy do wysokości najtańszego zwykłego sposobu dostarczenia, niezwłocznie, najpóźniej w ciągu 14 dni od otrzymania oświadczenia, tą samą metodą płatności. Możemy wstrzymać zwrot do otrzymania towaru lub dowodu jego odesłania.</p>
      <p ${p}>Prawo odstąpienia nie przysługuje, jeżeli zapieczętowane opakowanie napoju zostało otwarte po dostarczeniu. Otwarcie kartonu wysyłkowego nie pozbawia prawa zwrotu, a otwarcie produktu nie wyłącza prawa do reklamacji.</p>
      <p ${p}>Sprzedawca: NEW AGE FOOD sp. z o.o., ul. Modlińska 29a, 05-110 Jabłonna, NIP: 7011015138, tel. 798 865 865.</p>
      <p style="margin:0;font-size:13px;line-height:1.5;color:#0d160f;">W załącznikach przesyłamy Regulamin sklepu oraz formularz odstąpienia od umowy.</p>
    </div>
  `;
}

// Legal Attachments (local file in dev, public URL in prod)
function legalAttachments() {
  const origin = getOrigin().replace(/\/$/, "");
  const isLocal = /localhost|127\.0\.0\.1/.test(origin);
  return [LEGAL_DOCUMENTS.regulamin, LEGAL_DOCUMENTS.withdrawalForm].map((doc) => ({
    filename: doc.filename,
    path: isLocal
      ? path.join(process.cwd(), "public", doc.publicPath)
      : `${origin}${doc.publicPath}`,
  }));
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
    ${renderWithdrawalNotice()}
  `;

  return mailer.sendMail({
    to: order.user.email,
    subject: `Potwierdzenie zamówienia ${order.id}`,
    attachments: legalAttachments(),
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

  if (order.isB2BManual) {
    const body = `
      <p style="margin:0 0 14px;font-size:14px;color:#0d160f;">Twoje zamówienie <strong style="font-family:ui-monospace,Menlo,Monaco,monospace;">${order.id}</strong> zostało wysłane.</p>
      <p style="margin:0;font-size:14px;color:#2b6a4b;">Dostawa realizowana przez naszą firmę. Szczegóły dostawy ustalimy bezpośrednio.</p>
    `;
    return mailer.sendMail({
      to: order.user.email,
      subject: `Zamówienie ${order.id} zostało wysłane`,
      html: renderLayout({
        title: "Zamówienie wysłane",
        intro: "Zamówienie zostało przekazane do dostawy.",
        body,
      }),
    });
  }

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
