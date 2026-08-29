# OmniBiz API

The server runs on port `3000` by default and serves the Vite app plus the API routes below. Set `PORT` to use another port.

## Authentication

Create a demo session:

```http
POST /api/auth/session
Content-Type: application/json

{"email":"owner@example.com"}
```

Use the returned token as `Authorization: Bearer <token>` for protected routes. Sessions are held in server memory and must be replaced with a durable identity provider before production deployment.

## Protected CRM state

```http
GET /api/state
PUT /api/state
Authorization: Bearer <token>
```

The state payload contains `leads`, `campaigns`, `cadences`, `tasks`, `profile`, and optional webhook deduplication IDs.

## Campaign webhook

```http
POST /api/campaigns/webhook
Content-Type: application/json
X-Webhook-Secret: <CAMPAIGN_WEBHOOK_SECRET>

{
  "campaignId":"camp_123",
  "eventId":"provider-event-123",
  "name":"Alex Rivera",
  "company":"Prospect Inc",
  "email":"alex@example.com",
  "phone":"+1 512 555 0199",
  "contactPerson":"Alex Rivera"
}
```

`eventId` is used for deduplication. If it is omitted, campaign ID plus normalized email is used.

## Outreach provider callbacks

```http
POST /api/outreach/callback
Content-Type: application/json
X-Callback-Secret: <OUTREACH_CALLBACK_SECRET>

{
  "leadId":"lead_123",
  "eventType":"email",
  "status":"delivered",
  "detail":"Accepted by recipient server"
}
```

Email statuses: `queued`, `sent`, `delivered`, `bounced`, `failed`.
Call statuses: `queued`, `ringing`, `connected`, `completed`, `failed`.

## Provider configuration

Copy `.env.example` to `.env` and configure `GEMINI_API_KEY`, webhook secrets, and optional provider URLs/tokens. When provider URLs are empty, outreach uses explicit simulation mode. Configured providers receive JSON POST requests with a generated message or call ID. Requests use a 5-second timeout and up to three attempts.

## Development checks

```bash
npm run lint
npm run build
```
