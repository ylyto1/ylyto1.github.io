
CREATE TABLE public.tracking_config (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  meta_pixel_id TEXT NOT NULL DEFAULT '',
  ga_id TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tracking_config_singleton CHECK (id = TRUE)
);

GRANT SELECT ON public.tracking_config TO anon, authenticated;
GRANT INSERT, UPDATE ON public.tracking_config TO authenticated;
GRANT ALL ON public.tracking_config TO service_role;

ALTER TABLE public.tracking_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tracking config readable by all"
  ON public.tracking_config FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tracking config"
  ON public.tracking_config FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tracking config"
  ON public.tracking_config FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.tracking_config (id, meta_pixel_id, ga_id) VALUES (TRUE, '', '')
  ON CONFLICT (id) DO NOTHING;
