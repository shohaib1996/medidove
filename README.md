
# MediDove AI Clinic Platform

MediDove is a modern AI-powered clinic operations demo built with Next.js 16, Supabase, shadcn/ui, Tailwind CSS, ElevenLabs-ready voice workflows, Twilio-ready messaging, and consent-aware patient engagement.

This project started as an older medical website template and has been converted into a portfolio-ready meditech system for appointment automation, AI receptionist workflows, patient engagement, admin operations, and healthcare lead management.

## Positioning

MediDove is not an AI diagnosis product. It is designed for:

- Appointment booking and admin review
- AI-assisted department and doctor routing
- Contact lead triage
- Website assistant conversations
- ElevenLabs receptionist proof of concept
- WhatsApp, SMS, email, and voice outreach queueing
- Consent-aware reminders and follow-ups
- Patient, doctor, and admin dashboards
- Campaign and automation workflows

For real healthcare clients, production compliance work may be required, including HIPAA review, BAA agreements, call recording notices, access policies, audit retention, and vendor compliance checks.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn-style UI primitives
- Supabase Auth, Postgres, RLS, and pgvector-ready schema
- ElevenLabs-ready AI receptionist endpoints
- Twilio-ready SMS and WhatsApp provider dispatch
- Provider webhook support for email and outbound voice

## Main Features

- Public AI clinic landing page
- Supabase-backed doctors, departments, services, and AI knowledge content
- Supabase-backed blog CMS for healthcare SEO content
- Supabase-backed health packages for wellness, dental, and screening offers
- Supabase-backed wellness product catalog with staff-reviewed inquiries
- Product and package inquiry links that prefill contact leads for staff review
- Supabase-backed testimonials and proof points for buyer trust
- Real appointment request form
- Smart appointment intake API with emergency-safe routing language
- Floating AI clinic assistant widget
- Public search over services, doctors, departments, and AI knowledge
- Supabase authentication for patient, doctor, and admin roles
- Patient portal with profile, consent, and timeline views
- Doctor portal for assigned appointments and clinical context
- Admin staff directory for doctors, receptionists, and operators
- Admin dashboard with appointments, leads, calls, WhatsApp, analytics, and audit logs
- Admin content seeding for demo data
- Admin appointment operations
- Admin patient CRM
- Admin lead pipeline
- Admin AI lead capture from chat
- Admin communication inbox
- Admin message templates
- Admin outreach composer
- Admin automation rules and runner endpoint
- Provider dispatch endpoint with consent enforcement
- AI clinical notes workspace
- Patient feedback with sentiment triage
- Care task board and AI task generation endpoint
- Integration health dashboard
- AI campaign dashboard
- Admin clinic settings
- Privacy and terms pages

## Important Routes

- `/` public AI clinic home
- `/appointment` appointment booking
- `/packages` health package offers
- `/shop` wellness product catalog
- `/contact?product=...` and `/contact?package=...` staff-reviewed inquiries
- `/testimonials` testimonials and clinic proof
- `/blog` public healthcare SEO blog
- `/blog/[slug]` CMS-backed article details
- `/receptionist` ElevenLabs receptionist demo page
- `/engagement` WhatsApp and patient engagement page
- `/login` and `/register`
- `/portal`
- `/portal/consents`
- `/portal/timeline`
- `/doctor-portal`
- `/admin`
- `/admin/appointments`
- `/admin/patients`
- `/admin/leads`
- `/admin/ai-leads`
- `/admin/communications`
- `/admin/campaigns`
- `/admin/outreach`
- `/admin/automations`
- `/admin/tasks`
- `/admin/clinical-notes`
- `/admin/staff`
- `/admin/content`
- `/admin/blog`
- `/admin/products`
- `/admin/testimonials`
- `/admin/analytics`
- `/admin/audit`
- `/admin/integrations`
- `/admin/settings`
- `/privacy`
- `/terms`

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required for core Supabase features:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

Optional integration variables:

```bash
ELEVENLABS_API_KEY=
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=
ELEVENLABS_OUTBOUND_CALL_WEBHOOK_URL=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_PHONE=
TWILIO_WHATSAPP_FROM=

EMAIL_DELIVERY_WEBHOOK_URL=

AUTOMATION_RUN_SECRET=
OUTBOX_DISPATCH_SECRET=
TASK_GENERATION_SECRET=
```

Never commit real `.env` values.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Enable email/password auth in Supabase Auth settings.
5. Create a user through `/register` or Supabase Auth.
6. Set your admin user role in the `profiles` table:

```sql
update public.profiles
set role = 'admin'
where id = 'your-user-id';
```

7. Visit `/admin/content` and use the seed action to create demo services, doctors, knowledge, templates, and workflow records.

When schema changes are added in future phases, rerun the relevant SQL before testing the new admin page.

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Integration Notes

ElevenLabs:

- `/api/voice/signed-url` supports the conversational AI widget flow.
- `/api/voice/call-requests` records callback requests.
- Outbound voice dispatch can use `ELEVENLABS_OUTBOUND_CALL_WEBHOOK_URL`.

Twilio:

- `/api/twilio/voice/inbound` logs inbound phone calls and returns TwiML.
- `/api/twilio/whatsapp/inbound` logs inbound WhatsApp messages and returns TwiML.
- SMS dispatch uses `TWILIO_FROM_PHONE`.
- WhatsApp dispatch uses `TWILIO_WHATSAPP_FROM`.
- Consent is checked before dispatching SMS, WhatsApp, voice, or email records.

Automation:

- `/api/automations/run` runs automation rules when called with `AUTOMATION_RUN_SECRET`.
- `/api/outbox/dispatch` dispatches queued outbox records when called with `OUTBOX_DISPATCH_SECRET`.
- `/api/tasks/generate` creates staff task suggestions when called with `TASK_GENERATION_SECRET`.

## Demo Workflow

1. Seed demo data from `/admin/content`.
2. Create an appointment from `/appointment`.
3. Try the floating AI assistant on the public website.
4. Search for terms like `tooth pain`, `child fever`, or `heart doctor`.
5. Review new records in `/admin`.
6. Open `/admin/leads`, `/admin/appointments`, and `/admin/communications`.
7. Create a message template in `/admin/templates`.
8. Queue outreach in `/admin/outreach`.
9. Create a campaign in `/admin/campaigns`.
10. Check consent and provider readiness in `/admin/integrations`.
11. Review reporting in `/admin/analytics`.

## Safety Rules

- Do not position the app as a diagnosis tool.
- Use fake/sample patient data for portfolio demos.
- Include AI disclosure for chat and voice workflows.
- Require consent for marketing, reminders, and outbound calls.
- Include opt-out language in SMS and WhatsApp campaigns.
- Route emergency-like symptoms to emergency services.
- Keep sensitive medical record storage out of the demo unless real compliance requirements are implemented.

## Upwork Portfolio Angle

Suggested title:

`AI Medical Receptionist Platform with Next.js, Supabase, ElevenLabs, Twilio, and WhatsApp`

Short description:

`A full-stack meditech demo that automates appointment intake, AI receptionist callbacks, patient reminders, WhatsApp engagement, admin workflows, campaign outreach, and analytics with consent-aware delivery controls.`

## Deployment

Recommended deployment:

- Vercel for Next.js
- Supabase Cloud for database and auth
- Twilio for SMS, WhatsApp, and phone workflows
- ElevenLabs for conversational voice receptionist
- A transactional email provider connected through `EMAIL_DELIVERY_WEBHOOK_URL`

Before production launch, configure `NEXT_PUBLIC_SITE_URL`, real domains, provider webhooks, privacy terms, staff access rules, logging retention, and compliance review.
