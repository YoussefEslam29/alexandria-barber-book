-- Migration: Frictionless Booking (Remove auth from bookings)
-- Run this in Supabase Dashboard → SQL Editor

-- =================================================
-- 1. Create customers table for loyalty tracking
-- =================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  visit_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for new bookings)
CREATE POLICY "Anyone can insert customers" ON public.customers
  FOR INSERT WITH CHECK (true);

-- Anyone can read (needed for phone lookup during booking)
CREATE POLICY "Anyone can read customers" ON public.customers
  FOR SELECT USING (true);

-- Anyone can update (to increment visit_count)
CREATE POLICY "Anyone can update customers" ON public.customers
  FOR UPDATE USING (true);

-- Barbers can do everything
CREATE POLICY "Barbers full access to customers" ON public.customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_barber = true)
  );

-- =================================================
-- 2. Alter bookings: drop user_id, add guest fields
-- =================================================

-- Drop old RLS policies that depend on user_id
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;

-- Drop the user_id column (and its FK constraint)
ALTER TABLE public.bookings DROP COLUMN IF EXISTS user_id;

-- Add new guest fields
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS customer_email TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS barber TEXT DEFAULT '';

-- New RLS: anyone can insert bookings (no auth required)
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Anyone can read their own bookings (by phone - for future use)
CREATE POLICY "Anyone can read bookings" ON public.bookings
  FOR SELECT USING (true);

-- Barbers can update any booking (status changes)
-- (The existing "Barbers can update any booking" policy stays)
-- (The existing "Barbers can view all bookings" policy stays)

-- =================================================
-- 3. Gallery table (if not already created)
-- =================================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  source_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery viewable by everyone" ON public.gallery
  FOR SELECT USING (true);

-- Seed gallery with sample images
INSERT INTO public.gallery (image_url, caption, source_link) VALUES
  ('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600', 'Clean fade 🔥', 'https://www.instagram.com/kral.saloon/'),
  ('https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600', 'Signature taper', 'https://www.instagram.com/kral.saloon/'),
  ('https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600', 'The full package', 'https://www.instagram.com/kral.saloon/')
ON CONFLICT DO NOTHING;
