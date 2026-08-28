create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  full_name text not null,
  slug text not null unique,
  specialty text not null,
  bio text,
  consultation_fee numeric(10,2),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.doctor_availability (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes integer not null default 30,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments(id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.health_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(10,2) not null default 0,
  duration text,
  audience text,
  features text[] not null default '{}',
  badge text,
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'wellness',
  description text not null,
  price numeric(10,2) not null default 0,
  image_url text,
  stock_status text not null default 'available',
  requires_prescription boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  category text not null default 'patient_experience',
  image_url text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category text not null default 'Clinic AI',
  image_url text,
  author_name text not null default 'MediDove Team',
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinic_settings (
  id text primary key default 'default',
  clinic_name text not null,
  phone text not null,
  email text not null,
  address text,
  business_hours text,
  whatsapp_number text,
  emergency_notice text,
  ai_disclosure text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  patient_name text not null,
  patient_email text,
  patient_phone text not null,
  requested_department text,
  requested_doctor text,
  requested_at timestamptz,
  reason text,
  ai_summary text,
  urgency text,
  status public.appointment_status not null default 'pending',
  source_channel text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinical_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  patient_name text not null,
  visit_type text not null default 'consultation',
  raw_note text not null,
  subjective text not null,
  objective text not null,
  assessment text not null,
  care_plan text not null,
  risk_flags text[] not null default '{}',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  ai_category text,
  ai_summary text,
  ai_urgency text,
  ai_suggested_reply text,
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.patient_feedback (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  name text not null,
  email text,
  phone text,
  rating integer not null check (rating between 1 and 5),
  category text not null default 'general',
  message text not null,
  ai_sentiment text not null,
  ai_summary text not null,
  ai_urgency text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  source_type text not null default 'manual',
  source_id text,
  title text not null,
  description text,
  priority text not null default 'medium',
  status text not null default 'open',
  due_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_documents (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_id uuid,
  title text not null,
  content text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.ai_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.ai_documents(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  visitor_id text,
  created_at timestamptz not null default now()
);

create table public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table public.ai_leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.ai_chat_sessions(id) on delete set null,
  visitor_id text,
  name text,
  email text,
  phone text,
  interest text not null,
  summary text not null,
  urgency text not null default 'low',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.call_logs (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete set null,
  phone_number text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  provider text not null default 'voice_provider',
  provider_call_id text,
  transcript text,
  ai_summary text,
  status text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete set null,
  phone_number text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  message text not null,
  provider_message_id text,
  status text,
  created_at timestamptz not null default now()
);

create table public.consent_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete set null,
  phone text,
  email text,
  channel public.communication_channel not null,
  consented boolean not null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.opt_outs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete set null,
  channel public.communication_channel not null,
  phone text,
  email text,
  reason text,
  source text not null default 'public_unsubscribe',
  created_at timestamptz not null default now()
);

create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  channel public.communication_channel not null,
  category text not null,
  body text not null,
  variables text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.communication_outbox (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.message_templates(id) on delete set null,
  patient_id uuid references public.profiles(id) on delete set null,
  channel public.communication_channel not null,
  recipient_name text,
  recipient_phone text,
  recipient_email text,
  subject text,
  message text not null,
  status text not null default 'queued',
  provider text,
  provider_message_id text,
  metadata jsonb not null default '{}',
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trigger_event text not null,
  channel public.communication_channel not null,
  audience text not null,
  delay_minutes integer not null default 0,
  template_id uuid references public.message_templates(id) on delete set null,
  instructions text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  campaign_type text not null,
  audience text not null,
  channel public.communication_channel not null,
  goal text,
  message text not null,
  ai_recommendation text,
  status text not null default 'draft',
  recipient_count integer not null default 0,
  queued_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  patient_id uuid references public.profiles(id) on delete set null,
  recipient_name text,
  recipient_phone text,
  recipient_email text,
  status text not null default 'queued',
  provider_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_type text not null default 'system',
  event_type text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
