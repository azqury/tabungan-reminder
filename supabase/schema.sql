create table goals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  target numeric not null,
  saved numeric not null default 0,
  amount_per_period numeric not null,
  frequency text not null check (frequency in ('daily','weekly','monthly')),
  email text not null,
  last_reminded date,
  created_at timestamptz default now()
);

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text unique not null,
  subscription jsonb not null
);
