create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

do $$
begin
  create type record_status as enum (
    'draft',
    'in_review',
    'published',
    'archived',
    'not_found_precisely'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type movement_type as enum (
    'interment',
    'exhumation',
    'transfer',
    'relocation',
    'ossuary_move',
    'other',
    'unknown'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type location_kind as enum (
    'grave',
    'tomb',
    'vault',
    'drawer',
    'niche',
    'ossuary',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists app_roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid not null references app_roles(id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cemeteries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  status record_status not null default 'draft',
  logical_map_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists sectors (
  id uuid primary key default gen_random_uuid(),
  cemetery_id uuid not null references cemeteries(id) on delete restrict,
  code text not null,
  name text not null,
  status record_status not null default 'draft',
  sort_order int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  unique (cemetery_id, code)
);

create table if not exists quadras (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references sectors(id) on delete restrict,
  code text not null,
  name text,
  status record_status not null default 'draft',
  sort_order int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  unique (sector_id, code)
);

create table if not exists alleys (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references sectors(id) on delete restrict,
  code text not null,
  name text,
  status record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  unique (sector_id, code)
);

create table if not exists burial_location_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  kind location_kind not null default 'other',
  default_capacity int not null default 1,
  allows_multiple boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint burial_location_types_capacity_check check (default_capacity >= 0)
);

create table if not exists map_nodes (
  id uuid primary key default gen_random_uuid(),
  cemetery_id uuid not null references cemeteries(id) on delete restrict,
  node_type text not null,
  x int not null,
  y int not null,
  w int not null,
  h int not null,
  label text,
  status record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint map_nodes_positive_size check (w > 0 and h > 0)
);

create table if not exists burial_locations (
  id uuid primary key default gen_random_uuid(),
  cemetery_id uuid not null references cemeteries(id) on delete restrict,
  sector_id uuid not null references sectors(id) on delete restrict,
  quadra_id uuid references quadras(id) on delete restrict,
  alley_id uuid references alleys(id) on delete restrict,
  type_id uuid not null references burial_location_types(id) on delete restrict,
  parent_location_id uuid references burial_locations(id) on delete restrict,
  map_node_id uuid references map_nodes(id) on delete set null,
  code text not null,
  label text,
  location_text text,
  status record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  unique (cemetery_id, code)
);

create table if not exists deceased_persons (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  birth_date date,
  death_date date,
  status record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists deceased_persons_full_name_trgm_idx
  on deceased_persons using gin (full_name gin_trgm_ops);

create table if not exists burial_cases (
  id uuid primary key default gen_random_uuid(),
  cemetery_id uuid not null references cemeteries(id) on delete restrict,
  deceased_person_id uuid not null references deceased_persons(id) on delete restrict,
  public_reference text,
  status record_status not null default 'draft',
  approx_location_text text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint burial_cases_public_reference_check check (public_reference is null or length(public_reference) <= 64)
);

create unique index if not exists burial_cases_public_reference_uniq
  on burial_cases (public_reference)
  where public_reference is not null;

create index if not exists burial_cases_cemetery_status_idx
  on burial_cases (cemetery_id, status);

create table if not exists remains_movements (
  id uuid primary key default gen_random_uuid(),
  burial_case_id uuid not null references burial_cases(id) on delete restrict,
  movement_type movement_type not null,
  occurred_on date,
  from_location_id uuid references burial_locations(id) on delete restrict,
  to_location_id uuid references burial_locations(id) on delete restrict,
  is_confirmed boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint remains_movements_from_or_to_check check (from_location_id is not null or to_location_id is not null),
  constraint remains_movements_type_minimum_check check (
    (movement_type <> 'interment' or to_location_id is not null)
    and (movement_type <> 'exhumation' or from_location_id is not null)
  )
);

create index if not exists remains_movements_case_time_idx
  on remains_movements (burial_case_id, occurred_on desc, created_at desc);

create table if not exists family_responsibles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  relationship_note text,
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists burial_case_family (
  id uuid primary key default gen_random_uuid(),
  burial_case_id uuid not null references burial_cases(id) on delete restrict,
  family_responsible_id uuid not null references family_responsibles(id) on delete restrict,
  relationship text,
  created_at timestamptz not null default now(),
  unique (burial_case_id, family_responsible_id)
);

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_user_id uuid,
  action text not null,
  schema_name text not null,
  table_name text not null,
  record_id uuid,
  before_data jsonb,
  after_data jsonb
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function audit_row_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid;
  v_action text;
  v_record_id uuid;
begin
  v_actor := auth.uid();
  v_action := tg_op;
  v_record_id := null;

  if (tg_op = 'INSERT') then
    begin
      v_record_id := (to_jsonb(new) ->> 'id')::uuid;
    exception when others then
      v_record_id := null;
    end;

    insert into audit_log(actor_user_id, action, schema_name, table_name, record_id, before_data, after_data)
    values (v_actor, v_action, tg_table_schema, tg_table_name, v_record_id, null, to_jsonb(new));
    return new;
  elsif (tg_op = 'UPDATE') then
    begin
      v_record_id := (to_jsonb(new) ->> 'id')::uuid;
    exception when others then
      v_record_id := null;
    end;

    insert into audit_log(actor_user_id, action, schema_name, table_name, record_id, before_data, after_data)
    values (v_actor, v_action, tg_table_schema, tg_table_name, v_record_id, to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'DELETE') then
    begin
      v_record_id := (to_jsonb(old) ->> 'id')::uuid;
    exception when others then
      v_record_id := null;
    end;

    insert into audit_log(actor_user_id, action, schema_name, table_name, record_id, before_data, after_data)
    values (v_actor, v_action, tg_table_schema, tg_table_name, v_record_id, to_jsonb(old), null);
    return old;
  end if;

  return null;
end;
$$;

revoke all on function set_updated_at() from public;
revoke all on function audit_row_changes() from public;

drop trigger if exists tr_app_users_updated_at on app_users;
create trigger tr_app_users_updated_at before update on app_users
for each row execute function set_updated_at();

drop trigger if exists tr_cemeteries_updated_at on cemeteries;
create trigger tr_cemeteries_updated_at before update on cemeteries
for each row execute function set_updated_at();

drop trigger if exists tr_sectors_updated_at on sectors;
create trigger tr_sectors_updated_at before update on sectors
for each row execute function set_updated_at();

drop trigger if exists tr_quadras_updated_at on quadras;
create trigger tr_quadras_updated_at before update on quadras
for each row execute function set_updated_at();

drop trigger if exists tr_alleys_updated_at on alleys;
create trigger tr_alleys_updated_at before update on alleys
for each row execute function set_updated_at();

drop trigger if exists tr_burial_location_types_updated_at on burial_location_types;
create trigger tr_burial_location_types_updated_at before update on burial_location_types
for each row execute function set_updated_at();

drop trigger if exists tr_map_nodes_updated_at on map_nodes;
create trigger tr_map_nodes_updated_at before update on map_nodes
for each row execute function set_updated_at();

drop trigger if exists tr_burial_locations_updated_at on burial_locations;
create trigger tr_burial_locations_updated_at before update on burial_locations
for each row execute function set_updated_at();

drop trigger if exists tr_deceased_persons_updated_at on deceased_persons;
create trigger tr_deceased_persons_updated_at before update on deceased_persons
for each row execute function set_updated_at();

drop trigger if exists tr_burial_cases_updated_at on burial_cases;
create trigger tr_burial_cases_updated_at before update on burial_cases
for each row execute function set_updated_at();

drop trigger if exists tr_remains_movements_updated_at on remains_movements;
create trigger tr_remains_movements_updated_at before update on remains_movements
for each row execute function set_updated_at();

drop trigger if exists tr_family_responsibles_updated_at on family_responsibles;
create trigger tr_family_responsibles_updated_at before update on family_responsibles
for each row execute function set_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_cemeteries_audit'
  ) then
    create trigger tr_cemeteries_audit
    after insert or update or delete on cemeteries
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_sectors_audit'
  ) then
    create trigger tr_sectors_audit
    after insert or update or delete on sectors
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_quadras_audit'
  ) then
    create trigger tr_quadras_audit
    after insert or update or delete on quadras
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_alleys_audit'
  ) then
    create trigger tr_alleys_audit
    after insert or update or delete on alleys
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_burial_location_types_audit'
  ) then
    create trigger tr_burial_location_types_audit
    after insert or update or delete on burial_location_types
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_map_nodes_audit'
  ) then
    create trigger tr_map_nodes_audit
    after insert or update or delete on map_nodes
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_burial_locations_audit'
  ) then
    create trigger tr_burial_locations_audit
    after insert or update or delete on burial_locations
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_deceased_persons_audit'
  ) then
    create trigger tr_deceased_persons_audit
    after insert or update or delete on deceased_persons
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_burial_cases_audit'
  ) then
    create trigger tr_burial_cases_audit
    after insert or update or delete on burial_cases
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_remains_movements_audit'
  ) then
    create trigger tr_remains_movements_audit
    after insert or update or delete on remains_movements
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_family_responsibles_audit'
  ) then
    create trigger tr_family_responsibles_audit
    after insert or update or delete on family_responsibles
    for each row execute function audit_row_changes();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'tr_burial_case_family_audit'
  ) then
    create trigger tr_burial_case_family_audit
    after insert or update or delete on burial_case_family
    for each row execute function audit_row_changes();
  end if;
end $$;

create or replace function current_role_key()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.key
  from app_users u
  join app_roles r on r.id = u.role_id
  where u.id = auth.uid() and u.is_active = true
  limit 1;
$$;

create or replace function is_active_app_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from app_users u
    where u.id = auth.uid() and u.is_active = true
  );
$$;

create or replace function is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select current_role_key() in ('admin','editor');
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select current_role_key() = 'admin';
$$;

grant execute on function current_role_key() to anon, authenticated;
grant execute on function is_active_app_user() to anon, authenticated;
grant execute on function is_admin_or_editor() to anon, authenticated;
grant execute on function is_admin() to anon, authenticated;

alter table app_roles enable row level security;
alter table app_users enable row level security;
alter table cemeteries enable row level security;
alter table sectors enable row level security;
alter table quadras enable row level security;
alter table alleys enable row level security;
alter table burial_location_types enable row level security;
alter table map_nodes enable row level security;
alter table burial_locations enable row level security;
alter table deceased_persons enable row level security;
alter table burial_cases enable row level security;
alter table remains_movements enable row level security;
alter table family_responsibles enable row level security;
alter table burial_case_family enable row level security;
alter table audit_log enable row level security;

drop policy if exists p_app_roles_read on app_roles;
create policy p_app_roles_read on app_roles
for select to authenticated
using (is_active_app_user());

drop policy if exists p_app_roles_admin_manage on app_roles;
create policy p_app_roles_admin_manage on app_roles
for all to authenticated
using (is_admin())
with check (is_admin());

drop policy if exists p_app_users_self_read on app_users;
create policy p_app_users_self_read on app_users
for select to authenticated
using (id = auth.uid());

drop policy if exists p_app_users_admin_manage on app_users;
create policy p_app_users_admin_manage on app_users
for all to authenticated
using (is_admin())
with check (is_admin());

drop policy if exists p_cemeteries_public_read on cemeteries;
create policy p_cemeteries_public_read on cemeteries
for select to anon
using (status = 'published');

drop policy if exists p_cemeteries_staff_read on cemeteries;
create policy p_cemeteries_staff_read on cemeteries
for select to authenticated
using (is_active_app_user());

drop policy if exists p_cemeteries_staff_write on cemeteries;
create policy p_cemeteries_staff_write on cemeteries
for insert to authenticated
with check (is_admin_or_editor());

drop policy if exists p_cemeteries_staff_update on cemeteries;
create policy p_cemeteries_staff_update on cemeteries
for update to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_sectors_public_read on sectors;
create policy p_sectors_public_read on sectors
for select to anon
using (status = 'published');

drop policy if exists p_sectors_staff_read on sectors;
create policy p_sectors_staff_read on sectors
for select to authenticated
using (is_active_app_user());

drop policy if exists p_sectors_staff_write on sectors;
create policy p_sectors_staff_write on sectors
for insert to authenticated
with check (is_admin_or_editor());

drop policy if exists p_sectors_staff_update on sectors;
create policy p_sectors_staff_update on sectors
for update to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_quadras_public_read on quadras;
create policy p_quadras_public_read on quadras
for select to anon
using (status = 'published');

drop policy if exists p_quadras_staff_read on quadras;
create policy p_quadras_staff_read on quadras
for select to authenticated
using (is_active_app_user());

drop policy if exists p_quadras_staff_write on quadras;
create policy p_quadras_staff_write on quadras
for insert to authenticated
with check (is_admin_or_editor());

drop policy if exists p_quadras_staff_update on quadras;
create policy p_quadras_staff_update on quadras
for update to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_alleys_public_read on alleys;
create policy p_alleys_public_read on alleys
for select to anon
using (status = 'published');

drop policy if exists p_alleys_staff_manage on alleys;
create policy p_alleys_staff_manage on alleys
for all to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_burial_location_types_public_read on burial_location_types;
create policy p_burial_location_types_public_read on burial_location_types
for select to anon
using (true);

drop policy if exists p_burial_location_types_staff_manage on burial_location_types;
create policy p_burial_location_types_staff_manage on burial_location_types
for all to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_map_nodes_public_read on map_nodes;
create policy p_map_nodes_public_read on map_nodes
for select to anon
using (status = 'published');

drop policy if exists p_map_nodes_staff_manage on map_nodes;
create policy p_map_nodes_staff_manage on map_nodes
for all to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_burial_locations_public_read on burial_locations;
create policy p_burial_locations_public_read on burial_locations
for select to anon
using (status = 'published');

drop policy if exists p_burial_locations_staff_manage on burial_locations;
create policy p_burial_locations_staff_manage on burial_locations
for all to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_deceased_persons_staff_read on deceased_persons;
create policy p_deceased_persons_staff_read on deceased_persons
for select to authenticated
using (is_active_app_user());

drop policy if exists p_deceased_persons_staff_write on deceased_persons;
create policy p_deceased_persons_staff_write on deceased_persons
for insert to authenticated
with check (is_admin_or_editor());

drop policy if exists p_deceased_persons_staff_update on deceased_persons;
create policy p_deceased_persons_staff_update on deceased_persons
for update to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_burial_cases_staff_read on burial_cases;
create policy p_burial_cases_staff_read on burial_cases
for select to authenticated
using (is_active_app_user());

drop policy if exists p_burial_cases_staff_write on burial_cases;
create policy p_burial_cases_staff_write on burial_cases
for insert to authenticated
with check (is_admin_or_editor());

drop policy if exists p_burial_cases_staff_update on burial_cases;
create policy p_burial_cases_staff_update on burial_cases
for update to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_remains_movements_staff_read on remains_movements;
create policy p_remains_movements_staff_read on remains_movements
for select to authenticated
using (is_active_app_user());

drop policy if exists p_remains_movements_staff_insert on remains_movements;
create policy p_remains_movements_staff_insert on remains_movements
for insert to authenticated
with check (is_admin_or_editor());

drop policy if exists p_family_responsibles_staff_manage on family_responsibles;
create policy p_family_responsibles_staff_manage on family_responsibles
for all to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_burial_case_family_staff_manage on burial_case_family;
create policy p_burial_case_family_staff_manage on burial_case_family
for all to authenticated
using (is_admin_or_editor())
with check (is_admin_or_editor());

drop policy if exists p_audit_log_admin_read on audit_log;
create policy p_audit_log_admin_read on audit_log
for select to authenticated
using (is_admin());

create or replace view v_current_burial_case_location
with (security_barrier = true)
as
select distinct on (m.burial_case_id)
  m.burial_case_id,
  case when m.to_location_id is not null then m.to_location_id else null end as current_location_id,
  m.movement_type as last_movement_type,
  m.occurred_on as last_occurred_on,
  m.created_at as last_recorded_at
from remains_movements m
where m.is_confirmed = true
order by m.burial_case_id, m.occurred_on desc nulls last, m.created_at desc;

create or replace view v_public_deceased_search
with (security_barrier = true, security_invoker = true)
as
select
  bc.id as burial_case_id,
  bc.public_reference,
  dp.full_name as deceased_name,
  dp.birth_date,
  dp.death_date,
  c.id as cemetery_id,
  c.name as cemetery_name,
  bl.id as current_location_id,
  bl.code as location_code,
  bl.label as location_label,
  s.id as sector_id,
  s.code as sector_code,
  s.name as sector_name,
  q.id as quadra_id,
  q.code as quadra_code,
  q.name as quadra_name,
  mn.id as map_node_id,
  mn.x as map_x,
  mn.y as map_y,
  mn.w as map_w,
  mn.h as map_h,
  bc.status,
  bc.approx_location_text,
  bc.updated_at
from burial_cases bc
join deceased_persons dp on dp.id = bc.deceased_person_id and dp.status = 'published'
join cemeteries c on c.id = bc.cemetery_id and c.status = 'published'
left join v_current_burial_case_location cur on cur.burial_case_id = bc.id
left join burial_locations bl on bl.id = cur.current_location_id and bl.status = 'published'
left join sectors s on s.id = bl.sector_id and s.status = 'published'
left join quadras q on q.id = bl.quadra_id and q.status = 'published'
left join map_nodes mn on mn.id = bl.map_node_id and mn.status = 'published'
where bc.status = 'published';

create or replace view v_public_deceased_detail
with (security_barrier = true, security_invoker = true)
as
select
  s.*,
  cur.last_movement_type,
  cur.last_occurred_on,
  cur.last_recorded_at
from v_public_deceased_search s
left join v_current_burial_case_location cur on cur.burial_case_id = s.burial_case_id;

create or replace view v_public_cemetery_map_nodes
with (security_barrier = true, security_invoker = true)
as
select
  mn.id,
  mn.cemetery_id,
  mn.node_type,
  mn.x,
  mn.y,
  mn.w,
  mn.h,
  mn.label
from map_nodes mn
join cemeteries c on c.id = mn.cemetery_id
where mn.status = 'published' and c.status = 'published';

revoke all on table deceased_persons from anon;
revoke all on table burial_cases from anon;
revoke all on table remains_movements from anon;

grant usage on schema public to anon, authenticated;

grant select on cemeteries, sectors, quadras, alleys, burial_location_types, burial_locations, map_nodes to anon;

grant select on v_public_deceased_search, v_public_deceased_detail, v_public_cemetery_map_nodes to anon;

grant select, insert, update, delete on app_roles, app_users, cemeteries, sectors, quadras, alleys,
  burial_location_types, map_nodes, burial_locations, deceased_persons, burial_cases, remains_movements,
  family_responsibles, burial_case_family
to authenticated;

grant select on audit_log to authenticated;
