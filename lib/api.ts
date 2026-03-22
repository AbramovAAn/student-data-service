import { Consent, Language, Program, Skill, Student } from '../types';

export interface BootstrapPayload {
  students: Student[];
  programs: Program[];
  languages: Language[];
  skills: Skill[];
  softSkills: Skill[];
  consents: Consent[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: response.statusText }));
    const message =
      typeof payload.error === 'string'
        ? payload.error
        : payload.error?.message || response.statusText || 'Request failed';
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getBootstrap: () => request<BootstrapPayload>('/bootstrap'),
  createStudent: (student: Omit<Student, 'id' | 'lastUpdated'>) =>
    request<Student>('/students', { method: 'POST', body: JSON.stringify(student) }),
  updateStudent: (student: Student) =>
    request<Student>(`/students/${student.id}`, { method: 'PUT', body: JSON.stringify(student) }),
  deleteStudent: (id: string) =>
    request<void>(`/students/${id}`, { method: 'DELETE' }),
  createConsent: (consent: Omit<Consent, 'id'>) =>
    request<Consent>('/consents', { method: 'POST', body: JSON.stringify(consent) }),
  updateConsent: (consent: Consent) =>
    request<Consent>(`/consents/${consent.id}`, { method: 'PUT', body: JSON.stringify(consent) }),
  createReference: (type: 'programs' | 'languages' | 'skills', item: { code: string; name: string }) =>
    request<Program | Language | Skill>(`/references/${type}`, { method: 'POST', body: JSON.stringify(item) }),
  deleteReference: (type: 'programs' | 'languages' | 'skills', id: string) =>
    request<void>(`/references/${type}/${id}`, { method: 'DELETE' }),
};
