export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  telegram: string;
  birthDate: string;
  program: string;
  course: number;
  gpa: number;
  yearEnrolled: number;
  languages: string[];
  skills: string[];
  softSkills: string[];
  practicalExperience: string;
  internshipPreferences: string;
  portfolioUrl: string;
  status: 'Active' | 'Graduated' | 'On leave';
  note?: string;
  avatar?: string;
  lastUpdated?: string;
}

export interface Program {
  id: string;
  code: string;
  name: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
}

export interface Skill {
  id: string;
  code: string;
  name: string;
}

export interface Consent {
  id: string;
  studentName: string;
  type: string;
  date: string;
  status: 'Active' | 'Revoked';
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: keyof Student | null;
  direction: SortDirection;
}
