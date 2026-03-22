import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../server/app.js';
import { pool } from '../server/db.js';
import { runMigrations } from '../server/migrate.js';
import { seedDatabase } from '../server/seed.js';

const createdStudentIds = [];
const createdStudentEmails = [];
const createdConsentIds = [];

let app;

function makeStudentPayload() {
  const timestamp = Date.now();
  const email = `api.test.${timestamp}@example.com`;

  return {
    fullName: `Тестовый Студент ${timestamp}`,
    email,
    phone: '+7 (999) 000-00-00',
    telegram: '@api_test_student',
    birthDate: '2004-04-20',
    program: 'Data Science',
    course: 2,
    gpa: 4.4,
    yearEnrolled: 2024,
    languages: ['ru', 'en'],
    skills: ['python', 'sql'],
    softSkills: ['communication', 'teamwork'],
    practicalExperience: 'Тестовый опыт',
    internshipPreferences: 'backend development',
    portfolioUrl: 'https://github.com/api-test-student',
    status: 'Active',
    note: 'Создано API-тестом',
  };
}

before(async () => {
  await runMigrations();
  await seedDatabase();
  app = createApp();
});

after(async () => {
  if (createdConsentIds.length > 0) {
    await pool.query('DELETE FROM consents WHERE id = ANY($1::text[])', [createdConsentIds]);
  }

  if (createdStudentIds.length > 0) {
    await pool.query('DELETE FROM students WHERE id = ANY($1::text[])', [createdStudentIds]);
  }

  if (createdStudentEmails.length > 0) {
    await pool.query('DELETE FROM students WHERE email = ANY($1::text[])', [createdStudentEmails]);
  }

  await pool.end();
});

test('GET /api/v1/health returns ok', async () => {
  const response = await request(app).get('/api/v1/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
});

test('GET /api/v1/students returns list with meta', async () => {
  const response = await request(app).get('/api/v1/students?page=1&pageSize=5');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
  assert.equal(typeof response.body.meta.total, 'number');
  assert.equal(response.body.meta.page, 1);
  assert.equal(response.body.meta.pageSize, 5);
});

test('GET /api/v1/students/{id} returns a student', async () => {
  const listResponse = await request(app).get('/api/v1/students?page=1&pageSize=1');
  const studentId = listResponse.body.data[0]?.id;

  assert.ok(studentId);

  const response = await request(app).get(`/api/v1/students/${studentId}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.data.id, studentId);
});

test('POST /api/v1/students creates a student', async () => {
  const payload = makeStudentPayload();
  const response = await request(app).post('/api/v1/students').send(payload);

  assert.equal(response.status, 201);
  assert.equal(response.body.email, payload.email);
  assert.equal(response.body.fullName, payload.fullName);
  assert.ok(response.body.id);

  createdStudentIds.push(response.body.id);
  createdStudentEmails.push(payload.email);
});

test('POST /api/v1/students returns 409 for duplicate email', async () => {
  const payload = makeStudentPayload();
  const firstResponse = await request(app).post('/api/v1/students').send(payload);

  assert.equal(firstResponse.status, 201);
  createdStudentIds.push(firstResponse.body.id);
  createdStudentEmails.push(payload.email);

  const duplicateResponse = await request(app).post('/api/v1/students').send(payload);

  assert.equal(duplicateResponse.status, 409);
  assert.equal(duplicateResponse.body.error.code, 'duplicate_entity');
});

test('GET /api/v1/programs returns list of reference items', async () => {
  const response = await request(app).get('/api/v1/programs');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length > 0);
  assert.equal(typeof response.body.data[0].code, 'string');
});

test('POST /api/v1/consents creates a consent', async () => {
  const payload = makeStudentPayload();
  const studentResponse = await request(app).post('/api/v1/students').send(payload);

  assert.equal(studentResponse.status, 201);
  createdStudentIds.push(studentResponse.body.id);
  createdStudentEmails.push(payload.email);

  const consentPayload = {
    studentName: studentResponse.body.fullName,
    type: 'Публикация достижений',
    date: '2026-03-22',
    status: 'Active',
  };

  const response = await request(app).post('/api/v1/consents').send(consentPayload);

  assert.equal(response.status, 201);
  assert.equal(response.body.studentName, consentPayload.studentName);
  assert.equal(response.body.type, consentPayload.type);
  assert.ok(response.body.id);

  createdConsentIds.push(response.body.id);
});
