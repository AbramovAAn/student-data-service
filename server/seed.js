import path from 'node:path';
import { pool } from './db.js';
import { loadMockData } from './mockDataLoader.js';
import { fileURLToPath } from 'node:url';

const referenceTables = [
  ['programs', 'mockPrograms'],
  ['languages', 'mockLanguages'],
  ['skills', 'mockSkills'],
  ['soft_skills', 'mockSoftSkills'],
];

async function seedReferenceTable(client, tableName, items) {
  const { rows } = await client.query(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
  if (rows[0].count > 0) {
    return;
  }

  for (const item of items) {
    await client.query(
      `INSERT INTO ${tableName} (id, code, name) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
      [item.id, item.code, item.name],
    );
  }
}

async function seedStudents(client, students) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM students');
  if (rows[0].count > 0) {
    return;
  }

  for (const student of students) {
    await client.query(
      `INSERT INTO students (
        id, full_name, email, phone, telegram, birth_date, program, course, gpa, year_enrolled,
        languages, skills, soft_skills, practical_experience, internship_preferences, portfolio_url,
        status, note, avatar, last_updated
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20
      ) ON CONFLICT (id) DO NOTHING`,
      [
        student.id,
        student.fullName,
        student.email,
        student.phone,
        student.telegram,
        student.birthDate,
        student.program,
        student.course,
        student.gpa,
        student.yearEnrolled,
        student.languages,
        student.skills,
        student.softSkills,
        student.practicalExperience,
        student.internshipPreferences,
        student.portfolioUrl,
        student.status,
        student.note ?? '',
        student.avatar ?? null,
        student.lastUpdated ?? new Date().toISOString(),
      ],
    );
  }
}

async function seedConsents(client, consents) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM consents');
  if (rows[0].count > 0) {
    return;
  }

  for (const consent of consents) {
    await client.query(
      `INSERT INTO consents (id, student_name, type, date, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [consent.id, consent.studentName, consent.type, consent.date, consent.status],
    );
  }
}

export async function seedDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      mockPrograms,
      mockLanguages,
      mockSkills,
      mockSoftSkills,
      mockStudents,
      mockConsents,
    } = await loadMockData();

    for (const [tableName, sourceKey] of referenceTables) {
      await seedReferenceTable(client, tableName, sourceKey === 'mockPrograms'
        ? mockPrograms
        : sourceKey === 'mockLanguages'
          ? mockLanguages
          : sourceKey === 'mockSkills'
            ? mockSkills
            : mockSoftSkills);
    }

    await seedStudents(client, mockStudents);
    await seedConsents(client, mockConsents);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed.');
      return pool.end();
    })
    .catch(async (error) => {
      console.error(error);
      await pool.end();
      process.exit(1);
    });
}
