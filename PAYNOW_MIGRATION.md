# PayNow Migration Plan

## Overview

Migration from Stripe Checkout Sessions to PayNow payment gateway for Polish e-commerce platform. This involves updating 10 files, modifying the database schema, and implementing PayNow's payment flow (create payment → redirect → webhook → verify).

**Current State:**

- Stripe Checkout Sessions (mode: "payment")
- Payment methods: card, BLIK, P24
- Dual verification: verify-session API + webhook
- Currency: PLN (prices in cents)
- Server-side only implementation (no client-side Stripe.js)

**Target State:**

- PayNow REST API integration
- Same payment methods (BLIK, P24, cards)
- Maintain dual verification pattern
- Complete replacement of Stripe
- wFirma invoice auto-generation after confirmed payment

## Migration Strategy

- ✅ Complete replacement - remove Stripe entirely
- ✅ Migrate historical data - update existing STRIPE records to PAYNOW
- ✅ REST API integration - direct HTTP calls to PayNow
- ✅ wFirma integration - automatic invoice creation on payment confirmation

## Files to Modify

### 1. Database Schema Changes

**File:** `prisma/schema.prisma`

**Changes:**

- Rename `PaymentMethod` enum value from `STRIPE` to `PAYNOW`
- Existing `Payment.transactionId` field is already nullable and compatible

```prisma
enum PaymentMethod {
  BANK_TRANSFER
  COD
  PAYNOW  // Changed from STRIPE
}
```

**Commands:**

```bash
npx prisma migrate dev --name replace_stripe_with_paynow
npx prisma generate
```

---

### 2. Payment Service Library

**Delete:** `src/lib/stripe.ts`

**Create:** `src/lib/paynow.ts`

**Implementation:**

```typescript
// PayNow API client initialization
// - PAYNOW_API_KEY and PAYNOW_SIGNATURE_KEY from env
// - Helper to create payment request (HMAC SHA-256 signature)
// - Helper to verify webhook signature
// - Helper to format amounts (integers in grosze)
// - Types for PayNow API responses and webhook payloads
```

**Required functions:**

- `createPayment(params)` - Creates payment and returns redirect URL
- `getPaymentStatus(paymentId)` - Fetches payment status
- `verifyWebhookSignature(body, signature)` - Validates webhook authenticity
- `formatAmountForPayNow(cents)` - Amount formatting (same as Stripe)

---

### 3. API Routes - Payment Creation

**Delete:** `src/app/api/payments/stripe/create-checkout-session/route.ts`

**Create:** `src/app/api/payments/paynow/create-payment/route.ts`

**Key logic to preserve:**

- ✅ Fetch prices from DB (never trust client)
- ✅ Validate products exist and are available
- ✅ Store payment ID as `transactionId` in Payment record
- ✅ Include `orderId` in metadata for verification

**PayNow API call:**

- Endpoint: `POST /v1/payments`
- Parameters: amount, currency (PLN), description, buyer email
- URLs: `continueUrl` (success redirect), `notifyUrl` (webhook)
- Store PayNow payment ID for later verification

**Return to client:**

```typescript
{ paymentId: string, redirectUrl: string }
```

---

### 4. API Routes - Payment Verification

**Delete:** `src/app/api/payments/stripe/verify-session/route.ts`

**Create:** `src/app/api/payments/paynow/verify-payment/route.ts`

**Key logic to preserve:**

- ✅ Verify payment belongs to order (check stored `transactionId`)
- ✅ Update Payment status to `COMPLETED`
- ✅ Update Order status to `PAID`
- ✅ Send confirmation email
- ✅ Transaction atomicity using `prisma.$transaction`

**PayNow API call:**

- Endpoint: `GET /v1/payments/{paymentId}/status`
- Check status is "CONFIRMED" or equivalent

**Return to client:**

```typescript
{ success: boolean, paid: boolean, receiptUrl?: string }
```

**Note:** PayNow may not provide receipt URLs like Stripe. Make this field optional.

---

### 5. API Routes - Webhook Handler

**Delete:** `src/app/api/payments/stripe/webhook/route.ts`

**Create:** `src/app/api/payments/paynow/webhook/route.ts`

**Key logic to preserve:**

- ✅ Signature verification (CRITICAL for security)
- ✅ Idempotency check (skip if already `COMPLETED`)
- ✅ Update Payment to `COMPLETED`
- ✅ Update Order to `PROCESSING`

**PayNow webhook:**

- Verify signature using `PAYNOW_SIGNATURE_KEY`
- Extract payment ID and status from payload
- Find Payment by `transactionId`
- Return 200 status (PayNow retries on non-200)

**Webhook payload example (PayNow):**

```json
{
  "paymentId": "NOLV-8F9-08C-W8M",
  "status": "CONFIRMED",
  "amount": 12345,
  "currency": "PLN"
}
```

---

### 5b. wFirma Invoice Integration

**Create:** `src/lib/wfirma.ts`

**Purpose:** Automatically generate a Polish VAT invoice (Faktura VAT) in wFirma after each confirmed PayNow payment. The invoice is created once and optionally emailed to the customer.

**Authentication (API Key — recommended for server-side):**

wFirma supports two auth methods. For a server-side integration without user-facing OAuth flows, use **API Key** with three headers on every request:

```
accessKey: <your accessKey>
secretKey: <your secretKey>
appKey:    <your appKey>
```

- `accessKey` + `secretKey`: created in wFirma → Ustawienia → Bezpieczeństwo → Aplikacje → Klucze API
- `appKey`: requested once from wFirma via https://wfirma.pl/kontakt/1#appKey (form submission, key delivered by email)

**Base URL:** `https://api2.wfirma.pl`

**Input/output format:** Use `?inputFormat=json&outputFormat=json` query params on all requests. JSON keys for arrays **must always use numeric indices** (e.g. `"invoicecontents": { "0": { "invoicecontent": {...} } }`).

**Required functions in `src/lib/wfirma.ts`:**

```typescript
// Types
interface WfirmaInvoiceItem {
  name: string;       // product name
  count: number;      // quantity (e.g. 1.0000)
  unit: string;       // e.g. "szt."
  price: number;      // gross price in PLN (e.g. 29.99) — price_type: "brutto"
  vat: number;        // VAT rate as integer: 23, 8, 5, 0
}

interface WfirmaCreateInvoiceParams {
  orderId: string;          // stored in id_external for tracking
  buyerName: string;
  buyerEmail: string;
  buyerStreet?: string;
  buyerCity?: string;
  buyerZip?: string;
  buyerNip?: string;        // optional — only for business buyers
  items: WfirmaInvoiceItem[];
  totalPaidInCents: number; // used for alreadypaid_initial
  paymentDate: string;      // ISO date string "YYYY-MM-DD"
}

// Creates a Faktura VAT and returns the wFirma invoice ID
createWfirmaInvoice(params: WfirmaCreateInvoiceParams): Promise<string>

// Sends the invoice PDF to the buyer's email via wFirma
sendWfirmaInvoice(invoiceId: string, email: string): Promise<void>
```

**`createWfirmaInvoice` — API call:**

- Endpoint: `POST https://api2.wfirma.pl/invoices/add?inputFormat=json&outputFormat=json&company_id={WFIRMA_COMPANY_ID}`
- Request body:
```json
{
  "api": {
    "invoices": {
      "0": {
        "invoice": {
          "type": "normal",
          "price_type": "brutto",
          "paymentmethod": "transfer",
          "alreadypaid_initial": "29.99",
          "currency": "PLN",
          "id_external": "ORDER_ID",
          "contractor": {
            "name": "Jan Kowalski",
            "email": "jan@example.com",
            "street": "ul. Testowa 1",
            "zip": "00-001",
            "city": "Warszawa"
          },
          "invoicecontents": {
            "0": {
              "invoicecontent": {
                "name": "Produkt",
                "count": "1.0000",
                "unit": "szt.",
                "price": "29.99",
                "vat": "23"
              }
            }
          }
        }
      }
    }
  }
}
```
- On success, response contains `invoices.0.invoice.id` — store this as `wfirmaInvoiceId`

**`sendWfirmaInvoice` — API call:**

- Endpoint: `POST https://api2.wfirma.pl/invoices/send/{invoiceId}?inputFormat=json&outputFormat=json&company_id={WFIRMA_COMPANY_ID}`
- Body:
```json
{
  "api": {
    "invoices": {
      "parameters": {
        "0": { "parameter": { "name": "email", "value": "jan@example.com" } },
        "1": { "parameter": { "name": "subject", "value": "Twoja faktura" } },
        "2": { "parameter": { "name": "body", "value": "W załączniku przesyłamy fakturę za zamówienie." } }
      }
    }
  }
}
```

**Where to call wFirma:**

wFirma invoice creation should be triggered **after payment confirmation** in two places:

1. **Webhook handler** (`src/app/api/payments/paynow/webhook/route.ts`) — primary trigger, when PayNow sends `CONFIRMED` status
2. **Verify-payment route** (`src/app/api/payments/paynow/verify-payment/route.ts`) — secondary/fallback, only if no wFirmaInvoiceId exists yet

Use a guard to ensure idempotency — check `wfirmaInvoiceId` before calling wFirma:
```typescript
if (!payment.wfirmaInvoiceId) {
  const invoiceId = await createWfirmaInvoice({ ... });
  await prisma.payment.update({ where: { id: payment.id }, data: { wfirmaInvoiceId: invoiceId } });
  await sendWfirmaInvoice(invoiceId, order.user.email);
}
```

**Error handling:** wFirma invoice creation must **never block** payment confirmation. Wrap calls in try/catch and log failures — the order remains PAID even if invoicing fails. Consider a retry mechanism or manual re-trigger in admin.

---

### 1b. Database Schema — wFirma Invoice ID

**File:** `prisma/schema.prisma`

**Add to `Payment` model:**
```prisma
model Payment {
  // ... existing fields ...
  wfirmaInvoiceId  String?   // wFirma invoice ID after successful creation
}
```

**Migration command:**
```bash
npx prisma migrate dev --name add_wfirma_invoice_id
npx prisma generate
```

---

### 6. Checkout Page Client

**File:** `src/app/(customFacing)/kasa/page.tsx`

**Lines to modify:** 574-602

**Changes:**

- Change API endpoint: `/api/payments/stripe/create-checkout-session` → `/api/payments/paynow/create-payment`
- Change redirect: `data.url` → `data.redirectUrl`
- Update variable names: `sessionId` → `paymentId`

**Before:**

```typescript
const response = await fetch('/api/payments/stripe/create-checkout-session', {...});
const data = await response.json();
window.location.href = data.url;
```

**After:**

```typescript
const response = await fetch('/api/payments/paynow/create-payment', {...});
const data = await response.json();
window.location.href = data.redirectUrl;
```

---

### 7. Order Confirmation Page

**File:** `src/app/(customFacing)/kasa/zlozone-zamowienie/[orderId]/page.tsx`

**Line to modify:** 47

**Changes:**

- Check for `paymentMethod: "PAYNOW"` instead of `"STRIPE"`
- Pass `payment_id` query param instead of `session_id`

**Before:**

```typescript
if (order.paymentMethod === "STRIPE" && searchParams.session_id) {
  // render VerifySessionClient
}
```

**After:**

```typescript
if (order.paymentMethod === "PAYNOW" && searchParams.payment_id) {
  // render VerifySessionClient
}
```

---

### 8. Order Verification Client Component

**File:** `src/app/(customFacing)/kasa/zlozone-zamowienie/verifyClient.tsx`

**Changes:**

- Call `/api/payments/paynow/verify-payment` instead of `/api/payments/stripe/verify-session`
- Update request body: `sessionId` → `paymentId`
- Adjust for new response format (receiptUrl may not exist)

**Before:**

```typescript
const response = await fetch("/api/payments/stripe/verify-session", {
  body: JSON.stringify({ sessionId, orderId }),
});
```

**After:**

```typescript
const response = await fetch("/api/payments/paynow/verify-payment", {
  body: JSON.stringify({ paymentId, orderId }),
});
```

---

### 9. Checkout Server Action

**File:** `src/app/(customFacing)/kasa/_actions.ts`

**Lines to modify:** 34, 202-236

**Changes:**

- Update Zod validation: `paymentMethod: z.enum(["COD", "PAYNOW"])`
- Update all payment method references

**Before:**

```typescript
paymentMethod: z.enum(["COD", "STRIPE"]);
```

**After:**

```typescript
paymentMethod: z.enum(["COD", "PAYNOW"]);
```

---

### 10. Admin Order Management

**File:** `src/app/api/admin/orders/[id]/route.ts`

**Line to modify:** 22

**Changes:**

- Update PATCH endpoint validation to accept `PAYNOW` instead of `STRIPE`

**Additional files to check:**

- Admin UI components in `src/app/admin/zamowienia/` for hardcoded payment method labels
- Order list/detail views that display payment method

---

### 11. Privacy Policy

**File:** `src/app/(customFacing)/privacy/page.tsx`

**Lines to modify:** 103, 136

**Changes:**

- Replace mentions of "Stripe" with "PayNow"
- Update payment processor description
- Update data handling statements

**Example:**

- Before: "Płatności online obsługiwane są przez Stripe"
- After: "Płatności online obsługiwane są przez PayNow"

---

### 12. Dependencies and Environment

**File:** `package.json`

**Remove:**

```json
"stripe": "^18.1.0",
"@stripe/stripe-js": "^7.3.0"
```

**Add (if using official SDK):**

```json
// Check https://github.com/pay-now for official packages
// Or rely on native fetch/axios for REST API calls
```

**Run:**

```bash
npm install
```

**Environment Variables:**

**Remove from `.env` and Vercel:**

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Add to `.env` and Vercel:**

```
PAYNOW_API_KEY=your_api_key_here
PAYNOW_SIGNATURE_KEY=your_signature_key_here
PAYNOW_PRODUCTION=false  # Set to true in production

# wFirma API (API Key auth — server-side only)
WFIRMA_ACCESS_KEY=your_access_key_here
WFIRMA_SECRET_KEY=your_secret_key_here
WFIRMA_APP_KEY=your_app_key_here        # Obtained from wFirma support form: https://wfirma.pl/kontakt/1#appKey
WFIRMA_COMPANY_ID=your_company_id_here  # Found in wFirma dashboard URL or via GET /user_companies/find
```

---

### 13. Data Migration Script

**Create:** `prisma/migrate-stripe-to-paynow.ts`

**Purpose:**

- Update all `Order` records with `paymentMethod: "STRIPE"` to `"PAYNOW"`
- Update all `Payment` records with `paymentMethodType: "STRIPE"` to `"PAYNOW"`
- Add audit trail/logging

**Implementation:**

```typescript
import prisma from "../src/db";

async function migrateStripeToPayNow() {
  const orderCount = await prisma.order.updateMany({
    where: { paymentMethod: "STRIPE" },
    data: { paymentMethod: "PAYNOW" },
  });

  const paymentCount = await prisma.payment.updateMany({
    where: { paymentMethodType: "STRIPE" },
    data: { paymentMethodType: "PAYNOW" },
  });

  console.log(`Migrated ${orderCount.count} orders`);
  console.log(`Migrated ${paymentCount.count} payments`);
}

migrateStripeToPayNow()
  .then(() => console.log("Migration complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run:**

```bash
tsx prisma/migrate-stripe-to-paynow.ts
```

---

## Implementation Order

1. **Preparation**

   - Read PayNow API documentation thoroughly
   - Obtain sandbox credentials
   - Set up PayNow dashboard and webhook URL

2. **Database Migration**

   - Update Prisma schema
   - Run migration
   - Create and run data migration script
   - Verify all records updated

3. **Core Libraries**

   - Create `src/lib/paynow.ts`
   - Implement signature generation/verification
   - Create `src/lib/wfirma.ts`
   - Implement `createWfirmaInvoice` + `sendWfirmaInvoice`
   - Test wFirma invoice creation in isolation

4. **API Routes**

   - Implement create-payment route
   - Implement verify-payment route
   - Implement webhook route (add wFirma call on CONFIRMED)
   - Test with PayNow sandbox + verify invoice appears in wFirma

5. **Client Updates**

   - Update checkout page
   - Update order confirmation page
   - Update verification component
   - Update server actions

6. **Admin and Documentation**

   - Update admin order management
   - Update privacy policy
   - Update any other references

7. **Cleanup**

   - Remove Stripe dependencies
   - Remove Stripe lib file
   - Remove Stripe API routes
   - Update environment variables

8. **Testing**
   - Full checkout flow test
   - Webhook delivery test
   - Email confirmation test
   - Admin panel test
   - COD flow verification (unchanged)

---

## wFirma API Reference

**Base URL:** `https://api2.wfirma.pl`

**Authentication:** API Key — three headers required on every request:
```
accessKey: {accessKey}
secretKey: {secretKey}
appKey:    {appKey}
```

**Format:** Add `?inputFormat=json&outputFormat=json&company_id={companyId}` to all requests. JSON arrays must use numeric object keys (`"0": {...}`, `"1": {...}`).

**Key Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/invoices/add` | Create invoice (Faktura VAT) |
| `GET`  | `/invoices/get/{id}` | Fetch invoice details |
| `POST` | `/invoices/send/{id}` | Email invoice PDF to customer |
| `POST` | `/payments/add` | Mark invoice as paid (if not set via `alreadypaid_initial`) |
| `GET`  | `/user_companies/find` | Look up your `company_id` |

**Invoice `type` values:**
- `normal` — Faktura VAT (standard, for VAT payers)
- `bill` — Faktura bez VAT (for non-VAT businesses)

**Invoice `paymentmethod` values:**
- `transfer` — przelew (use for PayNow online payments)
- `cash` — gotówka
- `payment_card` — kartą płatniczą

**Key invoice fields:**
- `alreadypaid_initial` — amount already paid (set to order total → invoice created as rozliczony/paid)
- `id_external` — free text field, store your internal `orderId` here
- `price_type` — `brutto` (prices include VAT) or `netto`

**Response status codes:**
- `status.code = "OK"` — success
- `status.code = "ERROR"` — validation failure, check `status.errors`
- `status.code = "AUTH"` — authentication failed

**Documentation:** https://doc.wfirma.pl/

---

## PayNow API Reference

**Base URLs:**

- Sandbox: `https://api.sandbox.paynow.pl`
- Production: `https://api.paynow.pl`

**Key Endpoints:**

- `POST /v1/payments` - Create payment
- `GET /v1/payments/{paymentId}/status` - Check status
- Webhook: Customer URL (configured in request)

**Authentication:**

- API Key in header: `Api-Key: {PAYNOW_API_KEY}`
- Signature for security: HMAC SHA-256

**Payment Methods:**

- BLIK
- Przelewy24 (P24)
- Cards (Visa, Mastercard)
- Apple Pay / Google Pay

**Documentation:**

- Quick Start: https://docs.paynow.pl/docs/v3/quick-start
- GitHub: https://github.com/pay-now

---

## Risk Mitigation

### Critical Security Checks

1. **Webhook Signature Verification**

   - MUST verify every webhook with PAYNOW_SIGNATURE_KEY
   - Reject unsigned or invalid webhooks
   - Prevent replay attacks

2. **Payment-Order Matching**

   - Verify `transactionId` matches between payment and order
   - Prevent using cheap payment to unlock expensive order

3. **Price Validation**

   - Always fetch prices from database
   - Never trust client-provided amounts
   - Compare PayNow amount with order total

4. **Idempotency**
   - Check payment status before updating
   - Skip if already COMPLETED
   - Handle duplicate webhooks gracefully

### Testing Strategy

**Development:**

- Use PayNow sandbox credentials
- Test all payment methods (BLIK, P24, card)
- Test webhook delivery with ngrok or similar
- Test payment failure scenarios
- Test COD orders (unaffected by changes)

**Staging:**

- Full end-to-end test with sandbox
- Load test checkout flow
- Verify email delivery
- Test admin panel operations

**Production:**

- Deploy during low-traffic period
- Monitor logs for first 24 hours
- Have rollback plan ready
- Keep Stripe credentials accessible for emergency

### Rollback Plan

If critical issues arise:

1. **Immediate Actions:**

   - Revert to previous deployment (Vercel/Git)
   - Restore Stripe environment variables
   - Notify customers of temporary payment issues

2. **Database Rollback:**

   ```sql
   -- Revert PaymentMethod enum values
   UPDATE "Order" SET "paymentMethod" = 'STRIPE' WHERE "paymentMethod" = 'PAYNOW';
   UPDATE "Payment" SET "paymentMethodType" = 'STRIPE' WHERE "paymentMethodType" = 'PAYNOW';
   ```

3. **Code Rollback:**
   - Git revert to last stable commit
   - Restore Stripe API routes
   - Reinstall Stripe dependencies

---

## Verification Checklist

### Development Phase

- [ ] PayNow sandbox account created
- [ ] API keys obtained and stored securely
- [ ] Database schema updated and migrated
- [ ] Data migration script created and tested
- [ ] `src/lib/paynow.ts` implemented
- [ ] `src/lib/wfirma.ts` implemented (`createWfirmaInvoice`, `sendWfirmaInvoice`)
- [ ] wFirma API Key credentials obtained (accessKey, secretKey, appKey, company_id)
- [ ] `Payment.wfirmaInvoiceId` field added to Prisma schema and migrated
- [ ] Create payment API route working
- [ ] Verify payment API route working
- [ ] Webhook route working and signature verified
- [ ] Invoice created in wFirma after confirmed payment
- [ ] Invoice sent to customer email via wFirma
- [ ] wFirmaInvoiceId stored on Payment record (idempotency)
- [ ] Checkout page redirects correctly
- [ ] Order confirmation page works
- [ ] Email confirmations sending
- [ ] TypeScript compiles without errors (`npm run build`)

### Testing Phase

- [ ] Successful payment flow (end-to-end)
- [ ] Failed payment handling
- [ ] Webhook delivery and processing
- [ ] Invoice created in wFirma after webhook CONFIRMED
- [ ] Invoice email delivered to buyer
- [ ] No duplicate invoice on second webhook delivery (idempotency guard works)
- [ ] Failed wFirma call does not block order confirmation
- [ ] COD orders still work (no invoice created for COD)
- [ ] Admin panel displays correct payment method
- [ ] Historical orders viewable and correct
- [ ] Privacy policy updated
- [ ] All Stripe references removed from codebase

### Production Deployment

- [ ] Production PayNow credentials configured in Vercel
- [ ] Webhook URL registered in PayNow dashboard
- [ ] Environment variables verified
- [ ] Stripe dependencies removed
- [ ] Database backup taken
- [ ] Monitoring/alerting configured
- [ ] Customer support briefed on new payment system
- [ ] Rollback plan documented and accessible

### Post-Deployment (24 hours)

- [ ] Monitor error logs
- [ ] Check payment success rate
- [ ] Verify webhook delivery rate
- [ ] Confirm email delivery
- [ ] Review customer support tickets
- [ ] Validate order status progression
- [ ] Check PayNow dashboard for anomalies

---

## Known Differences: Stripe vs PayNow

| Feature             | Stripe               | PayNow                            |
| ------------------- | -------------------- | --------------------------------- |
| Hosted checkout     | ✅ Checkout Sessions | ✅ Payment page redirect          |
| Receipt URL         | ✅ In payment_intent | ❓ Check API documentation        |
| Payment methods     | Card, BLIK, P24      | Card, BLIK, P24, Apple/Google Pay |
| Webhook signature   | ✅ HMAC              | ✅ HMAC SHA-256                   |
| Currency            | PLN (and 100+ more)  | PLN only                          |
| Test mode           | ✅ Separate keys     | ✅ Sandbox environment            |
| Customer management | ✅ Full API          | ❓ Check documentation            |
| Refunds             | ✅ API available     | ❓ Check documentation            |

**Action Items:**

- Research PayNow receipt/confirmation page features
- Confirm refund API availability (if needed)
- Check if PayNow provides customer management features

---

## Support and Documentation

**PayNow Resources:**

- Official Documentation: https://docs.paynow.pl/
- GitHub Organization: https://github.com/pay-now
- API Reference: https://docs.paynow.pl/docs/v3/api-reference
- Support: Check PayNow dashboard for contact options

**Internal Resources:**

- Code Review Document: `.claude/docs/code_review.md` (security findings)
- Architectural Patterns: `.claude/docs/architectural_patterns.md`
- Main Documentation: `CLAUDE.md`

---

## Timeline Estimate

| Phase                       | Duration     | Description                                |
| --------------------------- | ------------ | ------------------------------------------ |
| Research & Planning         | 1 day        | Read PayNow docs, obtain credentials       |
| Database Migration          | 2 hours      | Schema changes, data migration             |
| Core Library Implementation | 6 hours      | `paynow.ts` signature handling + `wfirma.ts` invoice client |
| API Routes                  | 7 hours      | All three routes (create, verify, webhook + wFirma) |
| Client Updates              | 3 hours      | Checkout, confirmation, verification       |
| Admin & Documentation       | 2 hours      | Admin panel, privacy policy                |
| Testing & QA                | 1 day        | Full flow testing, edge cases              |
| Production Deployment       | 1 day        | Deploy, monitor, verify                    |
| **Total**                   | **3-4 days** | Including testing and monitoring           |

---

## Contact and Questions

For questions about this migration plan:

- Review PayNow documentation first
- Check existing Stripe implementation for patterns to replicate
- Consult with team leads before making architectural changes
- Document any deviations from this plan

---

**Document Version:** 1.0  
**Last Updated:** 20 February 2026  
**Author:** GitHub Copilot  
**Status:** Ready for Implementation
