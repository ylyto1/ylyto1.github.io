
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can submit a lead from the public form
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read leads
CREATE POLICY "Admins can read leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete leads
CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
