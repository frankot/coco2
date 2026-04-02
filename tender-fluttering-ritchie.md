# Plan: wFirma Invoice Integration

## Context

The app needs automatic invoice generation when orders are paid. For Stripe orders, this triggers on payment confirmation (webhook). For COD orders, this triggers on order creation. Invoices are created in wFirma, sent to the customer via wFirma's email, and downloadable from the admin panel. A retry button in admin handles failed generations.

**Prerequisites:** You'll need to request an `appKey` from wFirma (via their form at doc.wfirma.pl) and generate `accessKey`/`secretKey` in wFirma Settings >> Security >> Applications >> API Keys. Add all three + your `company_id` to `.env`.

---

## Step 1: Prisma Schema — Add wFirma fields to Order

**File:** `prisma/schema.prisma`

Add to the `Order` model (after the Apaczka fields block):

```prisma
// wFirma invoice metadata
wfirmaInvoiceId       String?
wfirmaInvoiceNumber   String?
wfirmaInvoiceSentAt   DateTime?
```

Then run `npx prisma db push` to apply.

---

## Step 2: Create wFirma API Client

**New file:** `src/lib/wfirma.ts`

Follow the `src/lib/apaczka.ts` pattern — env-based credentials, a generic request helper, and typed methods.

- **Auth:** Three headers — `accessKey`, `secretKey`, `appKey`
- **Base URL:** `https://api2.wfirma.pl`
- **Format:** `?inputFormat=json&outputFormat=json&company_id={WFIRMA_COMPANY_ID}`
- **Env vars:** `WFIRMA_ACCESS_KEY`, `WFIRMA_SECRET_KEY`, `WFIRMA_APP_KEY`, `WFIRMA_COMPANY_ID`

Methods:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `createInvoice(params)` | `POST /invoices/add` | Create Faktura VAT with contractor data + line items |
| `sendInvoice(invoiceId, email, subject?, body?)` | `POST /invoices/send/{id}` | Email invoice PDF to customer |
| `downloadInvoice(invoiceId)` | `POST /invoices/download/{id}` | Returns PDF as Buffer |
| `getInvoice(invoiceId)` | `GET /invoices/get/{id}` | Get invoice details |

Key details for `createInvoice`:
- `type: "normal"` (Faktura VAT)
- `paymentmethod: "transfer"` for Stripe, `"cod"` for COD
- `paymentstate: "paid"` for Stripe, `"unpaid"` for COD
- `price_type: "brutto"` (prices include VAT)
- Prices converted from cents: `(pricePerItemInCents / 100).toFixed(2)`
- `vat: "23"` (standard Polish VAT)
- Shipping as extra line item `"Dostawa"` if `shippingCostInCents > 0`

---

## Step 3: Create Invoice Orchestration Function

**New file:** `src/lib/invoice.ts`

Export `generateAndSendInvoice(orderId: string): Promise<void>`

1. Fetch order with billingAddress, orderItems (with product), user
2. **Idempotency:** Early return if `order.wfirmaInvoiceId` is already set
3. Map order items → wFirma invoice content lines
4. Add shipping line item if applicable
5. Call `wfirma.createInvoice(...)` — extract `invoiceId` and `fullnumber` from response
6. Update Order: set `wfirmaInvoiceId`, `wfirmaInvoiceNumber`
7. Call `wfirma.sendInvoice(invoiceId, user.email)`
8. Update Order: set `wfirmaInvoiceSentAt`

Steps 5-8 each wrapped in try/catch with `console.error`. If creation fails, nothing saved. If send fails, invoice ID is still stored (admin can retry/download).

---

## Step 4: Integrate into Stripe Webhook (fire-and-forget)

**File:** `src/app/api/payments/stripe/webhook/route.ts`

After the existing `prisma.$transaction(...)` on line 33, add:

```typescript
generateAndSendInvoice(orderId).catch((err) => {
  console.error("[WFIRMA] Invoice generation failed for order", orderId, err);
});
```

Fire-and-forget — never blocks webhook response to Stripe.

---

## Step 5: Integrate into COD Order Creation

**File:** `src/app/(customFacing)/kasa/_actions.ts`

After the order creation transaction and confirmation email (around line 395), add the same fire-and-forget call for COD orders:

```typescript
if (paymentMethod === "COD") {
  generateAndSendInvoice(order.id).catch((err) => {
    console.error("[WFIRMA] Invoice generation failed for COD order", order.id, err);
  });
}
```

---

## Step 6: Admin API — Invoice PDF Download

**New file:** `src/app/api/admin/invoices/[id]/download/route.ts`

GET endpoint (admin-only via `createRouteHandler` with auth):
1. Param `id` = Order ID
2. Fetch order, check `wfirmaInvoiceId` exists (404 if not)
3. Call `wfirma.downloadInvoice(order.wfirmaInvoiceId)`
4. Return `NextResponse` with PDF buffer, `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="Faktura_{invoiceNumber}.pdf"`

Follows pattern from `src/app/api/admin/shipping/apaczka/waybill/[id]/route.ts`.

---

## Step 7: Admin API — Manual Retry

**New file:** `src/app/api/admin/invoices/[id]/retry/route.ts`

POST endpoint (admin-only):
1. Param `id` = Order ID
2. Clear existing `wfirmaInvoiceId` on the order (to bypass idempotency check)
3. Call `generateAndSendInvoice(orderId)` (awaited, not fire-and-forget — admin wants to know if it succeeded)
4. Return success/error response

---

## Step 8: Update Prisma Selects

**File:** `src/lib/selects.ts`

Add to `ORDER_LIST_SELECT`:
- `wfirmaInvoiceId: true`
- `wfirmaInvoiceNumber: true`

Add to `ORDER_DETAIL_INCLUDE` (or the select within it):
- `wfirmaInvoiceId: true`
- `wfirmaInvoiceNumber: true`
- `wfirmaInvoiceSentAt: true`

---

## Step 9: Admin UI — Order Actions & Detail Page

### OrderActions.tsx (`src/app/admin/zamowienia/_components/OrderActions.tsx`)

Add two new dropdown items:
- **"Pobierz fakturę"** — shown when `wfirmaInvoiceId` is truthy. Downloads PDF via `/api/admin/invoices/${id}/download` using the same blob download pattern as the Apaczka waybill label.
- **"Wygeneruj fakturę"** — shown when `wfirmaInvoiceId` is falsy (invoice missing/failed). Calls `POST /api/admin/invoices/${id}/retry`, shows toast on success/error.

Props to add: `wfirmaInvoiceId: string | null`

### Order Detail Page (`src/app/admin/zamowienia/[id]/page.tsx`)

- Extend the `Order` type to include `wfirmaInvoiceId`, `wfirmaInvoiceNumber`, `wfirmaInvoiceSentAt`
- In the order details card, add a row showing invoice number and sent date (if available)
- Add "Pobierz fakturę" button (when invoice exists) and "Wygeneruj fakturę" button (when missing)

### Orders List Page (`src/app/admin/zamowienia/page.tsx`)

- Pass `wfirmaInvoiceId` to `OrderActionsMenu` component

---

## Environment Variables

```env
WFIRMA_ACCESS_KEY=     # Generated in wFirma Settings >> Security >> API Keys
WFIRMA_SECRET_KEY=     # Shown only once when creating API key
WFIRMA_APP_KEY=        # Requested from wFirma via their form
WFIRMA_COMPANY_ID=     # Found in wFirma Settings panel (e.g., "My company (ID: 885367)")
```

---

## Verification

1. **Unit test the wFirma client:** Call `wfirma.createInvoice()` with test data, verify the response contains an invoice ID
2. **Test Stripe flow:** Make a test Stripe payment, verify:
   - Invoice appears in wFirma dashboard
   - Customer receives email with PDF
   - Order in admin shows invoice number
   - "Pobierz fakturę" button downloads a valid PDF
3. **Test COD flow:** Create a COD order, verify invoice is generated immediately
4. **Test retry:** Delete `wfirmaInvoiceId` from an order in DB, click "Wygeneruj fakturę" in admin, verify it regenerates
5. **Test resilience:** Set invalid wFirma credentials, create an order, verify webhook still succeeds and order status is updated correctly (invoice generation fails silently)

---

## Files Summary

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Modify — add 3 wFirma fields to Order |
| `src/lib/wfirma.ts` | **Create** — API client |
| `src/lib/invoice.ts` | **Create** — orchestration function |
| `src/app/api/payments/stripe/webhook/route.ts` | Modify — add fire-and-forget call |
| `src/app/(customFacing)/kasa/_actions.ts` | Modify — add fire-and-forget for COD |
| `src/app/api/admin/invoices/[id]/download/route.ts` | **Create** — PDF download endpoint |
| `src/app/api/admin/invoices/[id]/retry/route.ts` | **Create** — manual retry endpoint |
| `src/lib/selects.ts` | Modify — add wFirma fields to selects |
| `src/app/admin/zamowienia/_components/OrderActions.tsx` | Modify — add invoice buttons |
| `src/app/admin/zamowienia/[id]/page.tsx` | Modify — show invoice info + buttons |
| `src/app/admin/zamowienia/page.tsx` | Modify — pass wfirmaInvoiceId to actions |
