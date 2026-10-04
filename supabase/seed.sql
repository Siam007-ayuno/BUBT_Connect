-- Seed Departments
INSERT INTO departments (id, name, short_name) VALUES 
('10000000-0000-0000-0000-000000000001', 'Computer Science and Engineering', 'CSE'),
('10000000-0000-0000-0000-000000000002', 'Electrical and Electronic Engineering', 'EEE'),
('10000000-0000-0000-0000-000000000003', 'Business Administration', 'BBA'),
('10000000-0000-0000-0000-000000000004', 'English', 'ENG'),
('10000000-0000-0000-0000-000000000005', 'Law', 'LAW'),
('10000000-0000-0000-0000-000000000006', 'Economics', 'ECO'),
('10000000-0000-0000-0000-000000000007', 'Civil Engineering', 'CE'),
('10000000-0000-0000-0000-000000000008', 'Textile Engineering', 'TE');

-- Seed Batches for CSE
INSERT INTO batches (id, department_id, number, start_year) VALUES 
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 50, 2021),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 51, 2021),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 52, 2022),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 53, 2022);

-- Seed Post Categories
INSERT INTO post_categories (id, name, description) VALUES
('30000000-0000-0000-0000-000000000001', 'Academics', 'Course materials, grades, exams'),
('30000000-0000-0000-0000-000000000002', 'Campus Facilities', 'Library, labs, canteen, washrooms'),
('30000000-0000-0000-0000-000000000003', 'Administration', 'Registration, tuition fees, rules'),
('30000000-0000-0000-0000-000000000004', 'Clubs & Co-curricular', 'Club events, sports, cultural programs'),
('30000000-0000-0000-0000-000000000005', 'Career & Placement', 'Internships, job circulars, alumni advice'),
('30000000-0000-0000-0000-000000000006', 'IT Services', 'Wi-Fi, ERP, student portal issues'),
('30000000-0000-0000-0000-000000000007', 'Transportation', 'Varsity bus, parking'),
('30000000-0000-0000-0000-000000000008', 'General Discussion', 'Anything related to BUBT'),
('30000000-0000-0000-0000-000000000009', 'Lost & Found', 'Report lost or found items'),
('30000000-0000-0000-0000-000000000010', 'Housing & Accommodation', 'Mess, hostels near campus'),
('30000000-0000-0000-0000-000000000011', 'Health & Safety', 'Medical emergencies, campus safety'),
('30000000-0000-0000-0000-000000000012', 'Suggestions', 'Ideas to improve the university'),
('30000000-0000-0000-0000-000000000013', 'Questions', 'Ask anything to the community');

-- In a real scenario, you'd insert auth users first, then profiles.
-- The seed script serves as a schema mockup for the structure of data.
