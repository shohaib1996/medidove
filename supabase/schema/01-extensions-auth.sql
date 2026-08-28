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

create table public.staff_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text not null unique,
  phone text,
  role public.user_role not null default 'receptionist',
  status text not null default 'active' check (status in ('active', 'inactive', 'invited')),
  notes text,
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
