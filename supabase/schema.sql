-- WSDFE Inventory — run in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity integer not null default 0 check (quantity >= 0),
  sku text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inventory_log (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references inventory_items(id) on delete cascade,
  delta integer not null,
  quantity_after integer not null,
  created_at timestamptz not null default now()
);

create index if not exists inventory_log_item_id_idx on inventory_log (item_id);
create index if not exists inventory_items_updated_at_idx on inventory_items (updated_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists inventory_items_updated_at on inventory_items;
create trigger inventory_items_updated_at
  before update on inventory_items
  for each row execute function set_updated_at();

alter table inventory_items enable row level security;
alter table inventory_log enable row level security;

-- Public read for scan pages; writes go through Next.js API (service role)
create policy "Anyone can read inventory items"
  on inventory_items for select
  using (true);

create policy "Anyone can read inventory log"
  on inventory_log for select
  using (true);

alter publication supabase_realtime add table inventory_items;
