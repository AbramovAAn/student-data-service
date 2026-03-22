CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS soft_skills (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  telegram TEXT NOT NULL DEFAULT '',
  birth_date TEXT NOT NULL,
  program TEXT NOT NULL,
  course INTEGER NOT NULL,
  gpa NUMERIC(3, 1) NOT NULL,
  year_enrolled INTEGER NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  soft_skills TEXT[] NOT NULL DEFAULT '{}',
  practical_experience TEXT NOT NULL DEFAULT '',
  internship_preferences TEXT NOT NULL DEFAULT '',
  portfolio_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('Active', 'Graduated', 'On leave')),
  note TEXT NOT NULL DEFAULT '',
  avatar TEXT,
  last_updated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consents (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Revoked'))
);
