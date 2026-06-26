-- Qafilah private groups (1:1 with Gather Ummah travel events)

CREATE TYPE public.qafilah_group_status AS ENUM ('planning', 'active', 'alumni');
CREATE TYPE public.qafilah_member_role AS ENUM ('member', 'admin');

CREATE TABLE public.qafilah_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
  status public.qafilah_group_status NOT NULL DEFAULT 'planning',
  city text NOT NULL,
  ameer_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.qafilah_group_members (
  group_id uuid NOT NULL REFERENCES public.qafilah_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.qafilah_member_role NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE public.qafilah_group_state (
  group_id uuid PRIMARY KEY REFERENCES public.qafilah_groups(id) ON DELETE CASCADE,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX qafilah_group_members_user_id_idx ON public.qafilah_group_members(user_id);
CREATE INDEX qafilah_groups_status_idx ON public.qafilah_groups(status);

CREATE OR REPLACE FUNCTION public.is_qafilah_group_member(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.qafilah_group_members m
    WHERE m.group_id = p_group_id AND m.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_qafilah_group_admin(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.qafilah_group_members m
    WHERE m.group_id = p_group_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
  );
$$;

ALTER TABLE public.qafilah_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qafilah_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qafilah_group_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their qafilah groups"
  ON public.qafilah_groups FOR SELECT
  USING (public.is_qafilah_group_member(id));

CREATE POLICY "Admins can update qafilah groups"
  ON public.qafilah_groups FOR UPDATE
  USING (public.is_qafilah_group_admin(id))
  WITH CHECK (public.is_qafilah_group_admin(id));

CREATE POLICY "Members can view group members"
  ON public.qafilah_group_members FOR SELECT
  USING (public.is_qafilah_group_member(group_id));

CREATE POLICY "Members can view group state"
  ON public.qafilah_group_state FOR SELECT
  USING (public.is_qafilah_group_member(group_id));

CREATE POLICY "Members can update group state"
  ON public.qafilah_group_state FOR UPDATE
  USING (public.is_qafilah_group_member(group_id))
  WITH CHECK (public.is_qafilah_group_member(group_id));

CREATE OR REPLACE FUNCTION public.transfer_qafilah_ameer(p_group_id uuid, p_new_ameer_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF NOT public.is_qafilah_group_admin(p_group_id) THEN
    RAISE EXCEPTION 'Only group admin can transfer Ameer';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.qafilah_group_members
    WHERE group_id = p_group_id AND user_id = p_new_ameer_user_id
  ) THEN
    RAISE EXCEPTION 'New Ameer must be a group member';
  END IF;

  UPDATE public.qafilah_group_members SET role = 'member'
  WHERE group_id = p_group_id AND role = 'admin';

  UPDATE public.qafilah_group_members SET role = 'admin'
  WHERE group_id = p_group_id AND user_id = p_new_ameer_user_id;

  UPDATE public.qafilah_groups SET ameer_user_id = p_new_ameer_user_id
  WHERE id = p_group_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_qafilah_group(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_event public.events%ROWTYPE;
  v_group_id uuid;
  v_role public.qafilah_member_role := 'member';
  v_user_email text;
  v_user_name text;
  v_journey jsonb;
  v_state jsonb;
  v_start date;
  v_end date;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_event FROM public.events
  WHERE id = p_event_id AND is_approved = true AND category_slug = 'travel';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Travel event not found or not approved';
  END IF;

  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;
  SELECT COALESCE(display_name, split_part(v_user_email, '@', 1)) INTO v_user_name
  FROM public.profiles WHERE id = v_user_id;

  IF v_user_name IS NULL OR v_user_name = '' THEN
    v_user_name := split_part(v_user_email, '@', 1);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.rsvps WHERE event_id = p_event_id AND user_id = v_user_id
  ) THEN
    INSERT INTO public.rsvps (event_id, user_id, name, email, organizer_updates_consent)
    VALUES (p_event_id, v_user_id, v_user_name, COALESCE(v_user_email, ''), false);
  END IF;

  SELECT id INTO v_group_id FROM public.qafilah_groups WHERE event_id = p_event_id;

  IF v_group_id IS NULL THEN
    INSERT INTO public.qafilah_groups (event_id, city, ameer_user_id, status)
    VALUES (
      p_event_id,
      v_event.city,
      v_event.submitted_by,
      'planning'
    )
    RETURNING id INTO v_group_id;

    v_start := (v_event.starts_at AT TIME ZONE 'UTC')::date;
    v_end := COALESCE((v_event.ends_at AT TIME ZONE 'UTC')::date, v_start);

    v_journey := jsonb_build_object(
      'fromCity', '',
      'toCity', v_event.city,
      'venueName', COALESCE(v_event.venue_name, ''),
      'venueAddress', COALESCE(v_event.address, ''),
      'startDate', v_start::text,
      'endDate', v_end::text,
      'ameerName', '',
      'ameerPhone', ''
    );

    v_state := jsonb_build_object(
      'journey', v_journey,
      'brothers', '[]'::jsonb,
      'expenses', '[]'::jsonb,
      'checklist', '{}'::jsonb,
      'sunnahsDone', '{}'::jsonb,
      'duasDone', '{}'::jsonb,
      'salahDone', '{}'::jsonb,
      'duties', '{}'::jsonb,
      'qafilaType', 3,
      'selectedMonth', 'Muharram'
    );

    INSERT INTO public.qafilah_group_state (group_id, state, updated_by)
    VALUES (v_group_id, v_state, v_user_id);

    IF v_event.submitted_by IS NOT NULL THEN
      INSERT INTO public.qafilah_group_members (group_id, user_id, role)
      VALUES (v_group_id, v_event.submitted_by, 'admin')
      ON CONFLICT (group_id, user_id) DO UPDATE SET role = 'admin';
    END IF;
  END IF;

  IF v_user_id = (SELECT ameer_user_id FROM public.qafilah_groups WHERE id = v_group_id) THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.qafilah_group_members (group_id, user_id, role)
  VALUES (v_group_id, v_user_id, v_role)
  ON CONFLICT (group_id, user_id) DO UPDATE SET role = EXCLUDED.role;

  SELECT m.role INTO v_role FROM public.qafilah_group_members m
  WHERE m.group_id = v_group_id AND m.user_id = v_user_id;

  RETURN jsonb_build_object(
    'group_id', v_group_id,
    'role', v_role::text,
    'status', (SELECT status FROM public.qafilah_groups WHERE id = v_group_id)::text,
    'event_id', p_event_id,
    'event_title', v_event.title
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_qafilah_group(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.transfer_qafilah_ameer(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_qafilah_group_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_qafilah_group_admin(uuid) TO authenticated;
