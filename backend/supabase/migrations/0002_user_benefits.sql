-- Миграция 0002: недостающие поля профиля и сохраненные льготы пользователя
-- Выполняется в Supabase SQL Editor после 0001

alter table public.profiles
  add column if not exists housing text,
  add column if not exists disability_group integer,
  add column if not exists income_unknown boolean not null default false,
  add column if not exists income_range text;

create table if not exists public.user_benefits (
  user_id uuid not null references auth.users (id) on delete cascade,
  benefit_slug text not null,
  status text not null default 'saved',
  checked_documents jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, benefit_slug)
);

comment on table public.user_benefits is 'Сохраненные пользователем меры поддержки и прогресс оформления';

alter table public.user_benefits enable row level security;

create policy "user_benefits_select_own"
  on public.user_benefits for select
  using (auth.uid() = user_id);

create policy "user_benefits_insert_own"
  on public.user_benefits for insert
  with check (auth.uid() = user_id);

create policy "user_benefits_update_own"
  on public.user_benefits for update
  using (auth.uid() = user_id);

create policy "user_benefits_delete_own"
  on public.user_benefits for delete
  using (auth.uid() = user_id);
