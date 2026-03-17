-- ProofPulse Initial Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  company_name text,
  plan text default 'free' check (plan in ('free', 'creator', 'business')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  testimonial_count int default 0,
  created_at timestamptz default now()
);

-- Testimonial collection forms
create table public.forms (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  slug text unique not null,
  title text not null default 'Share Your Experience',
  description text,
  questions jsonb default '[]'::jsonb,
  thank_you_message text default 'Thank you for your testimonial!',
  collect_video boolean default false,
  collect_rating boolean default true,
  branding jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Collected testimonials
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid references public.forms on delete set null,
  user_id uuid references public.profiles on delete cascade not null,
  author_name text not null,
  author_email text,
  author_title text,
  author_avatar_url text,
  content text not null,
  rating int check (rating >= 1 and rating <= 5),
  video_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  tags text[] default '{}',
  is_featured boolean default false,
  source text default 'form' check (source in ('form', 'import', 'manual')),
  created_at timestamptz default now()
);

-- Embeddable widgets
create table public.widgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  type text default 'carousel' check (type in ('carousel', 'wall', 'badge', 'minimal')),
  config jsonb default '{}'::jsonb,
  testimonial_ids uuid[],
  filter_tags text[],
  show_branding boolean default true,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Email campaigns
create table public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  form_id uuid references public.forms on delete set null,
  name text not null,
  subject text not null,
  body text not null,
  recipient_emails text[] default '{}',
  status text default 'draft' check (status in ('draft', 'scheduled', 'sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- Indexes
create index idx_testimonials_user_id on public.testimonials(user_id);
create index idx_testimonials_form_id on public.testimonials(form_id);
create index idx_testimonials_status on public.testimonials(status);
create index idx_forms_user_id on public.forms(user_id);
create index idx_forms_slug on public.forms(slug);
create index idx_widgets_user_id on public.widgets(user_id);
create index idx_campaigns_user_id on public.campaigns(user_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.forms enable row level security;
alter table public.testimonials enable row level security;
alter table public.widgets enable row level security;
alter table public.campaigns enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Forms: users can CRUD their own forms
create policy "Users can view own forms"
  on public.forms for select
  using (auth.uid() = user_id);

create policy "Users can create forms"
  on public.forms for insert
  with check (auth.uid() = user_id);

create policy "Users can update own forms"
  on public.forms for update
  using (auth.uid() = user_id);

create policy "Users can delete own forms"
  on public.forms for delete
  using (auth.uid() = user_id);

-- Forms: public access for collection pages
create policy "Anyone can view active forms by slug"
  on public.forms for select
  using (is_active = true);

-- Testimonials: users can manage their own; public can insert
create policy "Users can view own testimonials"
  on public.testimonials for select
  using (auth.uid() = user_id);

create policy "Users can update own testimonials"
  on public.testimonials for update
  using (auth.uid() = user_id);

create policy "Users can delete own testimonials"
  on public.testimonials for delete
  using (auth.uid() = user_id);

create policy "Anyone can submit testimonials"
  on public.testimonials for insert
  with check (true);

-- Widgets: users can CRUD their own
create policy "Users can view own widgets"
  on public.widgets for select
  using (auth.uid() = user_id);

create policy "Users can create widgets"
  on public.widgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own widgets"
  on public.widgets for update
  using (auth.uid() = user_id);

create policy "Users can delete own widgets"
  on public.widgets for delete
  using (auth.uid() = user_id);

-- Widgets: public access for embed rendering
create policy "Anyone can view active widgets"
  on public.widgets for select
  using (is_active = true);

-- Campaigns: users can CRUD their own
create policy "Users can view own campaigns"
  on public.campaigns for select
  using (auth.uid() = user_id);

create policy "Users can create campaigns"
  on public.campaigns for insert
  with check (auth.uid() = user_id);

create policy "Users can update own campaigns"
  on public.campaigns for update
  using (auth.uid() = user_id);

create policy "Users can delete own campaigns"
  on public.campaigns for delete
  using (auth.uid() = user_id);

-- Function: Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Run handle_new_user on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function: Update testimonial count on insert/delete
create or replace function public.update_testimonial_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.profiles
    set testimonial_count = testimonial_count + 1
    where id = NEW.user_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.profiles
    set testimonial_count = testimonial_count - 1
    where id = OLD.user_id;
    return OLD;
  end if;
end;
$$ language plpgsql security definer;

create trigger on_testimonial_change
  after insert or delete on public.testimonials
  for each row execute function public.update_testimonial_count();
