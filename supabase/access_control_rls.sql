-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- TEAMS POLICIES
DROP POLICY IF EXISTS "Users can view teams they are members of" ON public.teams;
CREATE POLICY "Users can view teams they are members of"
ON public.teams FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = teams.id
    AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can update their own teams" ON public.teams;
CREATE POLICY "Admins can update their own teams"
ON public.teams FOR ALL
USING (admin_id = auth.uid());

-- TEAM MEMBERS POLICIES
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.team_members;
CREATE POLICY "Users can view their own memberships"
ON public.team_members FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can join a team (temp)" ON public.team_members;
CREATE POLICY "Anyone can join a team (temp)"
ON public.team_members FOR INSERT
WITH CHECK (true);

-- IDEAS POLICIES
DROP POLICY IF EXISTS "Ideas access policy" ON public.ideas;
CREATE POLICY "Ideas access policy"
ON public.ideas FOR SELECT
USING (
  scope = 'public' 
  OR (scope = 'personal' AND created_by = auth.uid())
  OR (scope = 'team' AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = ideas.team_id
    AND user_id = auth.uid()
  ))
);

DROP POLICY IF EXISTS "Insert ideas policy" ON public.ideas;
CREATE POLICY "Insert ideas policy"
ON public.ideas FOR INSERT
WITH CHECK (
  scope = 'public'
  OR (scope = 'personal' AND created_by = auth.uid())
  OR (scope = 'team' AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = ideas.team_id
    AND user_id = auth.uid()
  ))
);

DROP POLICY IF EXISTS "Update ideas policy" ON public.ideas;
CREATE POLICY "Update ideas policy"
ON public.ideas FOR UPDATE
USING (
  created_by = auth.uid()
  OR (scope = 'team' AND EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = ideas.team_id
    AND admin_id = auth.uid()
  ))
);

-- COMMENTS POLICIES
DROP POLICY IF EXISTS "View comments policy" ON public.comments;
CREATE POLICY "View comments policy"
ON public.comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.ideas
    WHERE id = comments.idea_id
  )
);

DROP POLICY IF EXISTS "Insert comments policy" ON public.comments;
CREATE POLICY "Insert comments policy"
ON public.comments FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (
      SELECT 1 FROM public.ideas
      WHERE id = comments.idea_id
      AND scope = 'public'
    ) OR EXISTS (
      SELECT 1 FROM public.ideas i
      JOIN public.team_members tm ON i.team_id = tm.team_id
      WHERE i.id = comments.idea_id
      AND tm.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.ideas
      WHERE id = comments.idea_id
      AND created_by = auth.uid()
    )
  )
);
