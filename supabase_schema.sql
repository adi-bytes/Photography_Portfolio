-- Create photos table
create table photos (
  id uuid default uuid_generate_v4() primary key,
  public_id text not null,
  url text not null,
  width integer not null,
  height integer not null,
  blur_data_url text,
  title text not null,
  alt_text text not null,
  slug text not null unique,
  exif jsonb,
  category_tags jsonb default '[]'::jsonb,
  mood_colors jsonb default '[]'::jsonb,
  story text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table photos enable row level security;

-- Policies
create policy "Public photos are viewable by everyone." on photos for select using (true);
create policy "Authenticated users can insert photos." on photos for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update photos." on photos for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete photos." on photos for delete using (auth.role() = 'authenticated');
