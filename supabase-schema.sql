-- Supabase Required Schema for IdeaStick

-- Users table is handled by Supabase Auth (auth.users), but we keep a public profile table.
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text not null,
  email text not null,
  avatar text
);

create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  admin_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('admin', 'member')),
  unique(team_id, user_id)
);

create table public.boards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  team_id uuid references public.teams(id) on delete cascade not null,
  admin_id uuid references public.profiles(id) not null,
  active_decision_round jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.ideas (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references public.boards(id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  scope text not null check (scope in ('public', 'personal', 'team')) default 'public',
  title text not null,
  description text,
  color text not null,
  status text not null check (status in ('new', 'discussion', 'selected', 'rejected')),
  created_by uuid references public.profiles(id) not null,
  author_name text not null,
  vote_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  user_name text not null,
  content text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  unique(user_id, idea_id)
);

-- Enable RLS (Row Level Security) and add basic policies later if needed
-- For immediate development, you might drop RLS, but it's recommended to add policies checking team membership.
