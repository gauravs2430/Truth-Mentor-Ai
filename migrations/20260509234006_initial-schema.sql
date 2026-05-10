-- =============================================
-- TruthMentor - Initial Schema
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  avatar_url TEXT,
  experience VARCHAR(50) DEFAULT 'beginner',
  current_position VARCHAR(100) DEFAULT '',
  target_role VARCHAR(100) DEFAULT '',
  mentor_tone VARCHAR(20) DEFAULT 'honest',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  level VARCHAR(50) DEFAULT 'beginner',
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  target_role VARCHAR(255),
  query TEXT NOT NULL,
  ai_raw TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON roadmaps(user_id);

CREATE TABLE IF NOT EXISTS roadmap_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resources JSONB,
  order_index INTEGER NOT NULL,
  phase VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_steps_roadmap ON roadmap_steps(roadmap_id);

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  step_id uuid references roadmap_steps(id) on delete cascade,
  status text default 'pending',
  completed_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  
  unique(user_id, step_id)
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id),
  title VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id);

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Skills: public read
CREATE POLICY skills_select ON skills FOR SELECT USING (true);

-- User Skills policies
CREATE POLICY user_skills_select ON user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_skills_insert ON user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_skills_delete ON user_skills FOR DELETE USING (auth.uid() = user_id);

-- Roadmaps policies
CREATE POLICY roadmaps_select ON roadmaps FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY roadmaps_insert ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY roadmaps_update ON roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY roadmaps_delete ON roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Roadmap Steps policies
CREATE POLICY steps_select ON roadmap_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_steps.roadmap_id AND (roadmaps.user_id = auth.uid() OR roadmaps.is_public = true))
);
CREATE POLICY steps_insert ON roadmap_steps FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_steps.roadmap_id AND roadmaps.user_id = auth.uid())
);

-- User Progress policies
CREATE POLICY progress_select ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY progress_insert ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY progress_update ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Chat Sessions policies
CREATE POLICY chat_sessions_select ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY chat_sessions_insert ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY chat_sessions_delete ON chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- Chat Messages policies
CREATE POLICY messages_select ON chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid())
);
CREATE POLICY messages_insert ON chat_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid())
);

-- Bookmarks policies
CREATE POLICY bookmarks_select ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY bookmarks_insert ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY bookmarks_delete ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Seed skills data
INSERT INTO skills (name, category) VALUES
  ('HTML', 'Frontend'),
  ('CSS', 'Frontend'),
  ('JavaScript', 'Frontend'),
  ('TypeScript', 'Frontend'),
  ('React', 'Frontend'),
  ('Next.js', 'Frontend'),
  ('Vue.js', 'Frontend'),
  ('Angular', 'Frontend'),
  ('TailwindCSS', 'Frontend'),
  ('Node.js', 'Backend'),
  ('Express.js', 'Backend'),
  ('Python', 'Backend'),
  ('Django', 'Backend'),
  ('FastAPI', 'Backend'),
  ('Java', 'Backend'),
  ('Spring Boot', 'Backend'),
  ('Go', 'Backend'),
  ('Rust', 'Backend'),
  ('PostgreSQL', 'Database'),
  ('MongoDB', 'Database'),
  ('MySQL', 'Database'),
  ('Redis', 'Database'),
  ('Docker', 'DevOps'),
  ('Kubernetes', 'DevOps'),
  ('AWS', 'Cloud'),
  ('GCP', 'Cloud'),
  ('Azure', 'Cloud'),
  ('Git', 'Tools'),
  ('Linux', 'Tools'),
  ('TensorFlow', 'AI/ML'),
  ('PyTorch', 'AI/ML'),
  ('Machine Learning', 'AI/ML'),
  ('Deep Learning', 'AI/ML'),
  ('NLP', 'AI/ML'),
  ('Computer Vision', 'AI/ML'),
  ('Data Analysis', 'Data'),
  ('Pandas', 'Data'),
  ('SQL', 'Data'),
  ('Kotlin', 'Mobile'),
  ('Swift', 'Mobile'),
  ('React Native', 'Mobile'),
  ('Flutter', 'Mobile')
ON CONFLICT (name) DO NOTHING;
