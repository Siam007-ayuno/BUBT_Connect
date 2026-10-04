-- Enums Setup
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'authority', 'alumni', 'super_admin');
CREATE TYPE post_type AS ENUM ('problem', 'suggestion', 'question', 'discussion');
CREATE TYPE post_status AS ENUM ('open', 'under_review', 'in_progress', 'resolved', 'rejected');
CREATE TYPE report_reason AS ENUM ('spam', 'harassment', 'hate_speech', 'misinformation', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');
CREATE TYPE notice_category AS ENUM ('exam', 'admission', 'result', 'holiday', 'fees', 'scholarship', 'general');
CREATE TYPE event_type AS ENUM ('seminar', 'workshop', 'club_event', 'sports', 'cultural', 'career_fair', 'exam_schedule', 'alumni_meetup');
CREATE TYPE rsvp_status AS ENUM ('going', 'interested', 'not_going');
CREATE TYPE club_member_role AS ENUM ('president', 'vice_president', 'secretary', 'member');
CREATE TYPE club_member_status AS ENUM ('pending', 'active', 'removed');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE vote_value AS ENUM ('1', '-1');
CREATE TYPE alumni_advice_category AS ENUM ('career', 'study_tips', 'industry_insights', 'university_feedback', 'success_story', 'ama');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'internship', 'freelance');
CREATE TYPE resource_type AS ENUM ('note', 'past_question', 'slide', 'book', 'other');
CREATE TYPE notification_type AS ENUM ('vote', 'comment', 'mention', 'notice', 'event', 'status_change', 'moderation', 'mentorship', 'system');
CREATE TYPE mentorship_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE lost_found_type AS ENUM ('lost', 'found');

-- Helper function for timestamp triggers
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tables Setup

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    short_name TEXT NOT NULL
);

CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    number INT NOT NULL,
    start_year INT NOT NULL
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    student_id TEXT,
    phone TEXT,
    verification_status verification_status DEFAULT 'pending'
);

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE post_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type post_type NOT NULL,
    status post_status DEFAULT 'open',
    category_id UUID REFERENCES post_categories(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    improvement_suggestion TEXT,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    view_count INT DEFAULT 0
);

CREATE TRIGGER update_posts_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    body TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_accepted BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_comments_modtime BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    value vote_value NOT NULL,
    CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)),
    UNIQUE (user_id, post_id),
    UNIQUE (user_id, comment_id)
);

CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id)
);

CREATE TABLE post_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    status post_status NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reason report_reason NOT NULL,
    details TEXT,
    status report_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    action_taken TEXT,
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL AND profile_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL AND profile_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NULL AND profile_id IS NOT NULL)
    )
);

CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category notice_category NOT NULL,
    target_roles user_role[],
    target_departments UUID[],
    target_batches UUID[],
    is_pinned BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    attachment_url TEXT
);

CREATE TRIGGER update_notices_modtime BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE notice_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
    UNIQUE(user_id, notice_id)
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type event_type NOT NULL,
    organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    club_id UUID, -- Assuming clubs will be defined later
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    max_capacity INT,
    cover_image_url TEXT
);

CREATE TRIGGER update_events_modtime BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    status rsvp_status NOT NULL,
    UNIQUE(user_id, event_id)
);

CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    logo_url TEXT,
    faculty_advisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    established_date DATE
);

CREATE TRIGGER update_clubs_modtime BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE events ADD CONSTRAINT fk_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE;

CREATE TABLE club_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    role club_member_role DEFAULT 'member',
    status club_member_status DEFAULT 'pending',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, club_id)
);

CREATE TABLE alumni_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    graduation_year INT NOT NULL,
    current_company TEXT,
    current_position TEXT,
    linkedin_url TEXT,
    is_mentor BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_alumni_profiles_modtime BEFORE UPDATE ON alumni_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE alumni_advice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category alumni_advice_category NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

CREATE TRIGGER update_alumni_advice_modtime BEFORE UPDATE ON alumni_advice FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE mentorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    mentee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status mentorship_status DEFAULT 'pending',
    UNIQUE(mentee_id, mentor_id)
);

CREATE TRIGGER update_mentorship_requests_modtime BEFORE UPDATE ON mentorship_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type job_type NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    expires_at TIMESTAMPTZ
);

CREATE TRIGGER update_jobs_modtime BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    uploader_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type resource_type NOT NULL,
    course_code TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL
);

CREATE TRIGGER update_resources_modtime BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE course_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    semester TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE
);

CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    is_multiple_choice BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ
);

CREATE TRIGGER update_polls_modtime BEFORE UPDATE ON polls FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

CREATE TABLE poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
    UNIQUE(user_id, poll_id, option_id)
);

CREATE TABLE lost_found (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type lost_found_type NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    image_url TEXT,
    is_resolved BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_lost_found_modtime BEFORE UPDATE ON lost_found FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT NOT NULL,
    changes JSONB
);

CREATE TABLE directory_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    department TEXT,
    email TEXT,
    phone TEXT,
    room_number TEXT
);

CREATE TABLE satisfaction_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT
);

-- Functions and Views

CREATE OR REPLACE FUNCTION check_user_role(target_user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = target_user_id;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE VIEW posts_public AS
SELECT 
    id,
    created_at,
    updated_at,
    title,
    body,
    CASE 
        WHEN is_anonymous = true AND (auth.uid() IS NULL OR check_user_role(auth.uid()) NOT IN ('authority', 'super_admin')) THEN NULL
        ELSE author_id 
    END as author_id,
    type,
    status,
    category_id,
    department_id,
    is_anonymous,
    improvement_suggestion,
    upvotes,
    downvotes,
    view_count
FROM posts;

-- Vote triggers

CREATE OR REPLACE FUNCTION update_vote_counts() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            IF NEW.value = '1' THEN
                UPDATE posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
            ELSE
                UPDATE posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.post_id IS NOT NULL THEN
            IF OLD.value = '1' THEN
                UPDATE posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
            ELSE
                UPDATE posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.post_id IS NOT NULL AND OLD.value != NEW.value THEN
            IF NEW.value = '1' THEN
                UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.post_id;
            ELSE
                UPDATE posts SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.post_id;
            END IF;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vote_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_vote_counts();

-- Full Text Search Indexes
CREATE INDEX posts_title_body_idx ON posts USING GIN (to_tsvector('english', title || ' ' || body));
CREATE INDEX notices_title_content_idx ON notices USING GIN (to_tsvector('english', title || ' ' || content));

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts." ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert posts." ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts." ON posts FOR UPDATE USING (auth.uid() = author_id OR check_user_role(auth.uid()) IN ('authority', 'super_admin'));

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments." ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments." ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own comments." ON comments FOR UPDATE USING (auth.uid() = author_id OR check_user_role(auth.uid()) IN ('authority', 'super_admin'));

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read votes." ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes." ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes." ON votes FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read notices." ON notices FOR SELECT USING (true);
CREATE POLICY "Authorities can insert notices." ON notices FOR INSERT WITH CHECK (check_user_role(auth.uid()) IN ('authority', 'super_admin'));
CREATE POLICY "Authorities can update notices." ON notices FOR UPDATE USING (check_user_role(auth.uid()) IN ('authority', 'super_admin'));

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read events." ON events FOR SELECT USING (true);
CREATE POLICY "Authorized roles can insert events." ON events FOR INSERT WITH CHECK (check_user_role(auth.uid()) IN ('authority', 'faculty', 'super_admin'));

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert reports." ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Authorities can view reports." ON reports FOR SELECT USING (check_user_role(auth.uid()) IN ('authority', 'super_admin'));
CREATE POLICY "Authorities can update reports." ON reports FOR UPDATE USING (check_user_role(auth.uid()) IN ('authority', 'super_admin'));
