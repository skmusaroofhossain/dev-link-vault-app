-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Categories RLS Policies
CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Tags RLS Policies
CREATE POLICY "Users can view their own tags"
  ON public.tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON public.tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON public.tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON public.tags FOR DELETE
  USING (auth.uid() = user_id);

-- Links RLS Policies
CREATE POLICY "Users can view their own links"
  ON public.links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- Link Tags RLS Policies (check ownership through the link)
CREATE POLICY "Users can view their own link tags"
  ON public.link_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = link_tags.link_id
      AND links.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own link tags"
  ON public.link_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = link_tags.link_id
      AND links.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own link tags"
  ON public.link_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = link_tags.link_id
      AND links.user_id = auth.uid()
    )
  );
