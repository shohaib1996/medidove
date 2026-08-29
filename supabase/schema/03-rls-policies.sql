alter table public.profiles enable row level security;
alter table public.staff_members enable row level security;
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_availability enable row level security;
alter table public.services enable row level security;
alter table public.health_packages enable row level security;
alter table public.products enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
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
alter table public.opt_outs enable row level security;
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

create policy "Public can read active health packages"
  on public.health_packages for select
  using (is_active = true);

create policy "Public can read active products"
  on public.products for select
  using (is_active = true);

create policy "Public can read published testimonials"
  on public.testimonials for select
  using (is_published = true);

create policy "Public can read published blog posts"
  on public.blog_posts for select
  using (is_published = true);

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

create policy "Doctors can manage own availability"
  on public.doctor_availability for all
  using (
    exists (
      select 1
      from public.doctors
      where doctors.id = doctor_availability.doctor_id
        and doctors.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.doctors
      where doctors.id = doctor_availability.doctor_id
        and doctors.profile_id = auth.uid()
    )
  );

create policy "Admins can manage services"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage health packages"
  on public.health_packages for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage testimonials"
  on public.testimonials for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage blog posts"
  on public.blog_posts for all
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

create policy "Staff can read own staff record"
  on public.staff_members for select
  using (profile_id = auth.uid());

create policy "Admins can read profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Patients can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can manage staff members"
  on public.staff_members for all
  using (public.is_admin())
  with check (public.is_admin());

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

create policy "Anyone can create opt outs"
  on public.opt_outs for insert
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

create policy "Patients can read own opt outs"
  on public.opt_outs for select
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

create policy "Patients can reschedule own pending appointments"
  on public.appointments for update
  using (auth.uid() = patient_id and status = 'pending')
  with check (auth.uid() = patient_id and status = 'pending');

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

create policy "Admins can read opt outs"
  on public.opt_outs for select
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
