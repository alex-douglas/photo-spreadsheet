-- PhotoSheet credits: service role only (no RLS policies for anon = deny public).
-- Run in Supabase SQL editor or via CLI.
--
-- Prereq: enable the "citext" extension (Dashboard → Database → Extensions, or:)
create extension if not exists citext;

create table if not exists public.device_wallets (
  device_id text primary key,
  credits integer not null default 0,
  first_ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_wallets (
  email citext primary key,
  credits integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists device_wallets_first_ip_created_idx
  on public.device_wallets (first_ip_hash, created_at);

alter table public.device_wallets enable row level security;
alter table public.email_wallets enable row level security;

-- No GRANT to anon/authenticated: only service_role (server) accesses these tables.
