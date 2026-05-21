-- ============================================
-- EXTENSIONES
-- ============================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
create type difficulty_level as enum ('beginner', 'intermediate', 'advanced');
create type exercise_type as enum ('fill_blank', 'order_blocks', 'code_challenge', 'quiz', 'debug');

-- ============================================
-- PROFILES (extiende auth.users)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 30),
  display_name text,
  avatar_url text,
  bio text,
  total_xp integer not null default 0 check (total_xp >= 0),
  current_level integer not null default 1 check (current_level >= 1),
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_at timestamptz,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- MÓDULOS
-- ============================================
create table modules (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text not null,
  icon text,
  order_index integer not null,
  difficulty difficulty_level not null,
  estimated_minutes integer not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- LECCIONES
-- ============================================
create table lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references modules(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  content_md text not null,
  order_index integer not null,
  xp_reward integer not null default 20,
  estimated_minutes integer not null default 5,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique(module_id, slug)
);

create index idx_lessons_module on lessons(module_id, order_index);

-- ============================================
-- EJERCICIOS
-- ============================================
create table exercises (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  type exercise_type not null,
  title text not null,
  prompt text not null,
  starter_code text,
  solution_code text not null,
  test_cases jsonb not null default '[]'::jsonb,
  hints jsonb default '[]'::jsonb,
  common_mistakes jsonb default '[]'::jsonb,
  difficulty integer not null check (difficulty between 1 and 5),
  xp_reward integer not null default 10,
  order_index integer not null,
  created_at timestamptz not null default now()
);

create index idx_exercises_lesson on exercises(lesson_id, order_index);

-- ============================================
-- PROGRESO DEL USUARIO
-- ============================================
create table user_lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  xp_earned integer not null default 0,
  attempts integer not null default 0,
  unique(user_id, lesson_id)
);

create index idx_user_lesson_progress_user on user_lesson_progress(user_id);

create table user_exercise_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete cascade,
  submitted_code text not null,
  is_correct boolean not null,
  execution_time_ms integer,
  error_message text,
  attempted_at timestamptz not null default now()
);

create index idx_user_exercise_attempts_user on user_exercise_attempts(user_id, attempted_at desc);

-- ============================================
-- BADGES
-- ============================================
create table badges (
  code text primary key,
  title text not null,
  description text not null,
  icon text not null,
  xp_bonus integer not null default 0,
  rarity text not null check (rarity in ('common','rare','epic','legendary'))
);

create table user_badges (
  user_id uuid not null references profiles(id) on delete cascade,
  badge_code text not null references badges(code) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, badge_code)
);

-- ============================================
-- ACTIVIDAD DIARIA (para heatmap y rachas)
-- ============================================
create table user_daily_activity (
  user_id uuid not null references profiles(id) on delete cascade,
  activity_date date not null,
  xp_earned integer not null default 0,
  lessons_completed integer not null default 0,
  exercises_solved integer not null default 0,
  primary key (user_id, activity_date)
);

-- ============================================
-- EVENTOS DE ANALYTICS (backup local de PostHog)
-- ============================================
create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  event_name text not null,
  properties jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_analytics_user_event on analytics_events(user_id, event_name, created_at desc);

-- ============================================
-- FUNCIÓN: Trigger para crear profile al registrarse
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function public.handle_updated_at();

-- ============================================
-- FUNCIÓN: Actualizar racha del usuario
-- ============================================
create or replace function public.update_user_streak(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_last_activity date;
  v_current_streak integer;
  v_today date := current_date;
begin
  select last_activity_at::date, current_streak
    into v_last_activity, v_current_streak
  from profiles where id = p_user_id;

  if v_last_activity = v_today then
    return;
  elsif v_last_activity = v_today - interval '1 day' then
    update profiles
      set current_streak = current_streak + 1,
          longest_streak = greatest(longest_streak, current_streak + 1),
          last_activity_at = now()
      where id = p_user_id;
  else
    update profiles
      set current_streak = 1,
          last_activity_at = now()
      where id = p_user_id;
  end if;
end;
$$;

-- ============================================
-- FUNCIÓN: Actualizar XP y nivel del usuario
-- ============================================
create or replace function public.award_xp(p_user_id uuid, p_xp integer)
returns integer
language plpgsql
security definer
as $$
declare
  v_total_xp integer;
  v_new_level integer;
begin
  update profiles
    set total_xp = total_xp + p_xp
    where id = p_user_id
    returning total_xp into v_total_xp;

  -- Fórmula de nivel: nivel = floor(sqrt(total_xp / 100)) + 1
  v_new_level := floor(sqrt(v_total_xp::float / 100)) + 1;

  update profiles
    set current_level = v_new_level
    where id = p_user_id and current_level < v_new_level;

  return v_total_xp;
end;
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table profiles enable row level security;
alter table user_lesson_progress enable row level security;
alter table user_exercise_attempts enable row level security;
alter table user_badges enable row level security;
alter table user_daily_activity enable row level security;
alter table analytics_events enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table exercises enable row level security;

-- Profiles
create policy "Profiles son visibles públicamente"
  on profiles for select using (true);

create policy "Usuarios pueden actualizar su propio profile"
  on profiles for update using (auth.uid() = id);

-- Progress
create policy "Solo lectura de progreso propio"
  on user_lesson_progress for select using (auth.uid() = user_id);

create policy "Solo escritura de progreso propio"
  on user_lesson_progress for all using (auth.uid() = user_id);

create policy "Solo lectura de intentos propios"
  on user_exercise_attempts for select using (auth.uid() = user_id);

create policy "Solo escritura de intentos propios"
  on user_exercise_attempts for insert with check (auth.uid() = user_id);

-- Badges
create policy "Badges visibles públicamente"
  on user_badges for select using (true);

create policy "Solo actividad propia"
  on user_daily_activity for all using (auth.uid() = user_id);

-- Contenido publicado
create policy "Módulos publicados son públicos"
  on modules for select using (is_published = true);

create policy "Lecciones publicadas son públicas"
  on lessons for select using (is_published = true);

create policy "Ejercicios son públicos si su lección lo es"
  on exercises for select using (
    exists (
      select 1 from lessons
      where lessons.id = exercises.lesson_id
        and lessons.is_published = true
    )
  );

-- Analytics
create policy "Solo insertar eventos propios"
  on analytics_events for insert with check (auth.uid() = user_id or user_id is null);

create policy "Solo ver eventos propios"
  on analytics_events for select using (auth.uid() = user_id);

-- ============================================
-- SEED: Badges del sistema
-- ============================================
insert into badges (code, title, description, icon, xp_bonus, rarity) values
  ('first_lesson',    'Primer Paso',      'Completaste tu primera lección',           '🎯', 50,  'common'),
  ('first_exercise',  'Manos a la Obra',  'Resolviste tu primer ejercicio',           '💪', 50,  'common'),
  ('streak_3',        'En Racha',         'Mantuviste una racha de 3 días',           '🔥', 100, 'common'),
  ('streak_7',        'Constancia',       'Mantuviste una racha de 7 días',           '⚡', 200, 'rare'),
  ('streak_30',       'Dedicado',         'Mantuviste una racha de 30 días',          '💎', 500, 'epic'),
  ('module_1',        'Las Bases',        'Completaste el Módulo 1',                  '🏆', 150, 'rare'),
  ('module_5',        'Mitad del Camino', 'Completaste el Módulo 5',                  '🌟', 300, 'epic'),
  ('all_modules',     'CodePath Master',  'Completaste todos los módulos',            '👑', 1000,'legendary'),
  ('speed_demon',     'Velocista',        'Resolviste un ejercicio en menos de 1 min','⚡', 75,  'rare'),
  ('perfect_score',   'Sin Errores',      'Completaste una lección sin errores',      '✨', 100, 'rare');
