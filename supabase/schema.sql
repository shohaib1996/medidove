create extension if not exists "pgcrypto";
create extension if not exists "vector";

create type public.user_role as enum ('patient', 'doctor', 'receptionist', 'admin');
create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'rescheduled');
create type public.lead_status as enum ('new', 'contacted', 'converted', 'closed', 'spam');
create type public.communication_channel as enum ('email', 'sms', 'whatsapp', 'voice');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'patient',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'patient'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

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

create table public.call_logs (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete set null,
  phone_number text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  provider text not null default 'twilio',
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

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.contact_leads enable row level security;
alter table public.ai_documents enable row level security;
alter table public.ai_document_chunks enable row level security;
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;
alter table public.call_logs enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.consent_logs enable row level security;

create policy "Public can read active departments"
  on public.departments for select
  using (is_active = true);

create policy "Public can read active doctors"
  on public.doctors for select
  using (is_active = true);

create policy "Public can read active services"
  on public.services for select
  using (is_active = true);

create policy "Admins can manage departments"
  on public.departments for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage doctors"
  on public.doctors for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Patients can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Patients can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Anyone can create contact leads"
  on public.contact_leads for insert
  with check (true);

create policy "Anyone can create appointment requests"
  on public.appointments for insert
  with check (true);

create policy "Anyone can create WhatsApp message requests"
  on public.whatsapp_messages for insert
  with check (true);

create policy "Anyone can create consent logs"
  on public.consent_logs for insert
  with check (true);

create policy "Patients can read own appointments"
  on public.appointments for select
  using (auth.uid() = patient_id);

create policy "Admins can read appointments"
  on public.appointments for select
  using (public.is_admin());

create policy "Admins can update appointments"
  on public.appointments for update
  using (public.is_admin());

create policy "Admins can read contact leads"
  on public.contact_leads for select
  using (public.is_admin());

create policy "Admins can update contact leads"
  on public.contact_leads for update
  using (public.is_admin());

create policy "Admins can read call logs"
  on public.call_logs for select
  using (public.is_admin());

create policy "Admins can update call logs"
  on public.call_logs for update
  using (public.is_admin());

create policy "Admins can read WhatsApp messages"
  on public.whatsapp_messages for select
  using (public.is_admin());

create policy "Admins can update WhatsApp messages"
  on public.whatsapp_messages for update
  using (public.is_admin());

create policy "Admins can read consent logs"
  on public.consent_logs for select
  using (public.is_admin());

create index departments_slug_idx on public.departments(slug);
create index doctors_slug_idx on public.doctors(slug);
create index doctors_department_id_idx on public.doctors(department_id);
create index services_slug_idx on public.services(slug);
create index services_department_id_idx on public.services(department_id);
create index appointments_status_idx on public.appointments(status);
create index appointments_requested_at_idx on public.appointments(requested_at);
create index contact_leads_ai_urgency_idx on public.contact_leads(ai_urgency);
create index call_logs_status_idx on public.call_logs(status);
create index whatsapp_messages_status_idx on public.whatsapp_messages(status);
create index consent_logs_channel_idx on public.consent_logs(channel);
create index ai_document_chunks_embedding_idx
  on public.ai_document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
