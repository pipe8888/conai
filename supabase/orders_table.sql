-- Tabla de órdenes
create table if not exists orders (
  id              uuid default gen_random_uuid() primary key,
  order_id        text unique not null,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  shipping_address      text,
  shipping_city         text,
  shipping_country      text,
  shipping_postal_code  text,
  items           jsonb not null,
  total           numeric(10,2) not null,
  payment_brand   text,
  payment_last4   text,
  status          text default 'paid',
  created_at      timestamptz default now()
);

-- Índices útiles
create index if not exists orders_email_idx on orders(customer_email);
create index if not exists orders_created_at_idx on orders(created_at desc);

-- RLS: clientes anónimos pueden crear órdenes, solo admins pueden leerlas
alter table orders enable row level security;

create policy "anyone can insert orders"
  on orders for insert
  to anon, authenticated
  with check (true);

create policy "only authenticated can read orders"
  on orders for select
  to authenticated
  using (true);
