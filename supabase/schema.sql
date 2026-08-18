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

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_availability enable row level security;
alter table public.services enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.appointments enable row level security;
alter table public.clinical_notes enable row level security;
alter table public.contact_leads enable row level security;
alter table public.patient_feedback enable row level security;
alter table public.care_tasks enable row level security;
alter table public.ai_documents enable row level security;
alter table public.ai_document_chunks enable row level security;
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;
alter table public.ai_leads enable row level security;
alter table public.call_logs enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.consent_logs enable row level security;
alter table public.message_templates enable row level security;
alter table public.communication_outbox enable row level security;
alter table public.automation_rules enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_recipients enable row level security;
alter table public.audit_logs enable row level security;

create policy "Public can read active departments"
  on public.departments for select
  using (is_active = true);

create policy "Public can read active doctors"
  on public.doctors for select
  using (is_active = true);

create policy "Doctors can read linked doctor profile"
  on public.doctors for select
  using (profile_id = auth.uid());

create policy "Public can read active doctor availability"
  on public.doctor_availability for select
  using (is_active = true);

create policy "Doctors can read own availability"
  on public.doctor_availability for select
  using (
    exists (
      select 1
      from public.doctors
      where doctors.id = doctor_availability.doctor_id
        and doctors.profile_id = auth.uid()
    )
  );

create policy "Public can read active services"
  on public.services for select
  using (is_active = true);

create policy "Public can read clinic settings"
  on public.clinic_settings for select
  using (id = 'default');

create policy "Admins can manage departments"
  on public.departments for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage doctors"
  on public.doctors for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage doctor availability"
  on public.doctor_availability for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage clinic settings"
  on public.clinic_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage AI documents"
  on public.ai_documents for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage AI document chunks"
  on public.ai_document_chunks for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can read AI chat sessions"
  on public.ai_chat_sessions for select
  using (public.is_admin());

create policy "Admins can read AI chat messages"
  on public.ai_chat_messages for select
  using (public.is_admin());

create policy "Admins can manage AI leads"
  on public.ai_leads for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Patients can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Patients can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Anyone can create contact leads"
  on public.contact_leads for insert
  with check (true);

create policy "Anyone can create patient feedback"
  on public.patient_feedback for insert
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

create policy "Doctors can read assigned appointments"
  on public.appointments for select
  using (
    exists (
      select 1
      from public.doctors
      where doctors.id = appointments.doctor_id
        and doctors.profile_id = auth.uid()
    )
  );

create policy "Patients can read own consent logs"
  on public.consent_logs for select
  using (auth.uid() = patient_id);

create policy "Patients can read own reviewed clinical notes"
  on public.clinical_notes for select
  using (auth.uid() = patient_id and status = 'reviewed');

create policy "Doctors can read assigned clinical notes"
  on public.clinical_notes for select
  using (
    exists (
      select 1
      from public.appointments
      join public.doctors on doctors.id = appointments.doctor_id
      where appointments.id = clinical_notes.appointment_id
        and doctors.profile_id = auth.uid()
    )
  );

create policy "Patients can read own communication outbox"
  on public.communication_outbox for select
  using (auth.uid() = patient_id);

create policy "Patients can read own feedback"
  on public.patient_feedback for select
  using (auth.uid() = patient_id);

create policy "Admins can read appointments"
  on public.appointments for select
  using (public.is_admin());

create policy "Admins can update appointments"
  on public.appointments for update
  using (public.is_admin());

create policy "Admins can manage clinical notes"
  on public.clinical_notes for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can read contact leads"
  on public.contact_leads for select
  using (public.is_admin());

create policy "Admins can update contact leads"
  on public.contact_leads for update
  using (public.is_admin());

create policy "Admins can read patient feedback"
  on public.patient_feedback for select
  using (public.is_admin());

create policy "Admins can update patient feedback"
  on public.patient_feedback for update
  using (public.is_admin());

create policy "Admins can manage care tasks"
  on public.care_tasks for all
  using (public.is_admin())
  with check (public.is_admin());

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

create policy "Admins can manage message templates"
  on public.message_templates for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage communication outbox"
  on public.communication_outbox for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage automation rules"
  on public.automation_rules for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage campaigns"
  on public.campaigns for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage campaign recipients"
  on public.campaign_recipients for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can read audit logs"
  on public.audit_logs for select
  using (public.is_admin());

create policy "Admins can create audit logs"
  on public.audit_logs for insert
  with check (public.is_admin() or actor_type = 'system');

create index departments_slug_idx on public.departments(slug);
create index doctors_slug_idx on public.doctors(slug);
create index doctors_profile_id_idx on public.doctors(profile_id);
create index doctors_department_id_idx on public.doctors(department_id);
create index doctor_availability_doctor_id_idx on public.doctor_availability(doctor_id);
create index doctor_availability_weekday_idx on public.doctor_availability(weekday);
create index services_slug_idx on public.services(slug);
create index services_department_id_idx on public.services(department_id);
create index appointments_status_idx on public.appointments(status);
create index appointments_requested_at_idx on public.appointments(requested_at);
create index clinical_notes_patient_id_idx on public.clinical_notes(patient_id);
create index clinical_notes_appointment_id_idx on public.clinical_notes(appointment_id);
create index clinical_notes_created_at_idx on public.clinical_notes(created_at desc);
create index contact_leads_ai_urgency_idx on public.contact_leads(ai_urgency);
create index patient_feedback_status_idx on public.patient_feedback(status);
create index patient_feedback_sentiment_idx on public.patient_feedback(ai_sentiment);
create index patient_feedback_created_at_idx on public.patient_feedback(created_at desc);
create index care_tasks_status_idx on public.care_tasks(status);
create index care_tasks_priority_idx on public.care_tasks(priority);
create index care_tasks_due_at_idx on public.care_tasks(due_at);
create index care_tasks_assigned_to_idx on public.care_tasks(assigned_to);
create index call_logs_status_idx on public.call_logs(status);
create index whatsapp_messages_status_idx on public.whatsapp_messages(status);
create index consent_logs_channel_idx on public.consent_logs(channel);
create index consent_logs_patient_channel_idx on public.consent_logs(patient_id, channel, created_at desc);
create index consent_logs_phone_channel_idx on public.consent_logs(phone, channel, created_at desc);
create index consent_logs_email_channel_idx on public.consent_logs(email, channel, created_at desc);
create index message_templates_channel_idx on public.message_templates(channel);
create index message_templates_category_idx on public.message_templates(category);
create index communication_outbox_channel_idx on public.communication_outbox(channel);
create index communication_outbox_status_idx on public.communication_outbox(status);
create index automation_rules_trigger_event_idx on public.automation_rules(trigger_event);
create index automation_rules_active_idx on public.automation_rules(is_active);
create index campaigns_status_idx on public.campaigns(status);
create index campaigns_channel_idx on public.campaigns(channel);
create index campaign_recipients_campaign_id_idx on public.campaign_recipients(campaign_id);
create index campaign_recipients_status_idx on public.campaign_recipients(status);
create index audit_logs_event_type_idx on public.audit_logs(event_type);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index ai_chat_messages_session_id_idx on public.ai_chat_messages(session_id);
create index ai_leads_status_idx on public.ai_leads(status);
create index ai_leads_session_id_idx on public.ai_leads(session_id);
create index ai_leads_created_at_idx on public.ai_leads(created_at desc);
create index ai_document_chunks_embedding_idx
  on public.ai_document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
