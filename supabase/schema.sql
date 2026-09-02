-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enum types safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('mudir', 'admin', 'guru', 'ustadz', 'santri', 'orangtua');
    END IF;
END $$;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    kelas VARCHAR(50) DEFAULT '1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: setoran
CREATE TABLE IF NOT EXISTS setoran (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    santri_id UUID REFERENCES users(id) ON DELETE CASCADE,
    santri_name VARCHAR(100) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    surah VARCHAR(100) NOT NULL,
    ayat VARCHAR(50) NOT NULL,
    audio_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, dinilai
    nilai_tajwid VARCHAR(10),
    nilai_kelancaran VARCHAR(10),
    catatan_ustadz TEXT,
    ustadz_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) and grant policies for anon / authenticated access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE setoran ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon select users" ON users;
CREATE POLICY "Allow anon select users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert users" ON users;
CREATE POLICY "Allow anon insert users" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select setoran" ON setoran;
CREATE POLICY "Allow anon select setoran" ON setoran FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert setoran" ON setoran;
CREATE POLICY "Allow anon insert setoran" ON setoran FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update setoran" ON setoran;
CREATE POLICY "Allow anon update setoran" ON setoran FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete setoran" ON setoran;
CREATE POLICY "Allow anon delete setoran" ON setoran FOR DELETE USING (true);

-- Seed Initial Users
INSERT INTO users (username, password, role, kelas) VALUES
('aminawa', 'bips00', 'mudir', 'semua'),
('ratih', 'bips01', 'guru', '1'),
('hijri', 'bips02', 'guru', '2'),
('hanifah', 'bips03', 'guru', '3'),
('hasan', 'hasan', 'santri', '3'),
('abdullah', 'abdullah', 'santri', '3'),
('aisyahblora', 'aisyah', 'santri', '3'),
('hamzah', 'hamzah', 'santri', '3'),
('almubarok', 'almubarok', 'santri', '3'),
('faqih', 'faqih', 'santri', '3'),
('rosyid', 'rosyid', 'santri', '2'),
('fadheela', 'fadheela', 'santri', '2'),
('hafshoh', 'hafshoh', 'santri', '2'),
('alwi', 'alwi', 'santri', '2'),
('qilabah', 'qilabah', 'santri', '2'),
('syarif', 'syarif', 'santri', '2'),
('zizah', 'zizah', 'santri', '2'),
('aisyahseso', 'aisyahseso', 'santri', '1'),
('aisyahkarangjati', 'aisyahkarangjati', 'santri', '1'),
('mesya', 'mesya', 'santri', '1'),
('fatimah', 'fatimah', 'santri', '1'),
('hilyah', 'hilyah', 'santri', '1'),
('salman', 'salman', 'santri', '1'),
('tegar', 'tegar', 'santri', '1'),
('ishaq', 'ishaq', 'santri', '1'),
('muhammad', 'muhammad', 'santri', '1')
ON CONFLICT (username) DO UPDATE
SET password = EXCLUDED.password, role = EXCLUDED.role, kelas = EXCLUDED.kelas;
