import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const studentSortColumns = {
  fullName: 'full_name',
  email: 'email',
  program: 'program',
  course: 'course',
  gpa: 'gpa',
  yearEnrolled: 'year_enrolled',
  status: 'status',
  lastUpdated: 'last_updated',
};

export function mapStudentRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    telegram: row.telegram,
    birthDate: row.birth_date,
    program: row.program,
    course: row.course,
    gpa: Number(row.gpa),
    yearEnrolled: row.year_enrolled,
    languages: row.languages ?? [],
    skills: row.skills ?? [],
    softSkills: row.soft_skills ?? [],
    practicalExperience: row.practical_experience,
    internshipPreferences: row.internship_preferences,
    portfolioUrl: row.portfolio_url,
    status: row.status,
    note: row.note ?? '',
    avatar: row.avatar ?? undefined,
    lastUpdated: row.last_updated ?? undefined,
  };
}

export function mapReferenceRow(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
  };
}

export function mapConsentRow(row) {
  return {
    id: row.id,
    studentName: row.student_name,
    type: row.type,
    date: row.date,
    status: row.status,
  };
}

export async function getBootstrapData() {
  const [programs, languages, skills, softSkills, students, consents] = await Promise.all([
    pool.query('SELECT id, code, name FROM programs ORDER BY name'),
    pool.query('SELECT id, code, name FROM languages ORDER BY name'),
    pool.query('SELECT id, code, name FROM skills ORDER BY name'),
    pool.query('SELECT id, code, name FROM soft_skills ORDER BY name'),
    pool.query('SELECT * FROM students ORDER BY last_updated DESC, full_name ASC'),
    pool.query('SELECT * FROM consents ORDER BY date DESC, student_name ASC'),
  ]);

  return {
    programs: programs.rows.map(mapReferenceRow),
    languages: languages.rows.map(mapReferenceRow),
    skills: skills.rows.map(mapReferenceRow),
    softSkills: softSkills.rows.map(mapReferenceRow),
    students: students.rows.map(mapStudentRow),
    consents: consents.rows.map(mapConsentRow),
  };
}

export async function getStudentsList(options = {}) {
  const {
    search,
    program,
    status,
    language,
    skill,
    sortBy = 'lastUpdated',
    sortDir = 'desc',
    page = 1,
    pageSize = 20,
  } = options;

  const whereParts = [];
  const values = [];

  if (search) {
    values.push(`%${String(search).toLowerCase()}%`);
    const placeholder = `$${values.length}`;
    whereParts.push(
      `(LOWER(full_name) LIKE ${placeholder} OR LOWER(email) LIKE ${placeholder} OR LOWER(telegram) LIKE ${placeholder})`,
    );
  }

  if (program) {
    values.push(String(program));
    whereParts.push(`program = $${values.length}`);
  }

  if (status) {
    values.push(String(status));
    whereParts.push(`status = $${values.length}`);
  }

  if (language) {
    values.push(String(language));
    whereParts.push(`$${values.length} = ANY(languages)`);
  }

  if (skill) {
    values.push(String(skill));
    whereParts.push(`$${values.length} = ANY(skills)`);
  }

  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
  const normalizedPage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;
  const normalizedPageSize = Number.isFinite(Number(pageSize))
    ? Math.min(100, Math.max(1, Number(pageSize)))
    : 20;
  const offset = (normalizedPage - 1) * normalizedPageSize;
  const normalizedSortBy = studentSortColumns[sortBy] ? sortBy : 'lastUpdated';
  const sortColumn = studentSortColumns[normalizedSortBy];
  const normalizedSortDir = String(sortDir).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM students ${whereClause}`,
    values,
  );

  const listValues = [...values, normalizedPageSize, offset];
  const rowsResult = await pool.query(
    `SELECT * FROM students
     ${whereClause}
     ORDER BY ${sortColumn} ${normalizedSortDir}, full_name ASC
     LIMIT $${listValues.length - 1}
     OFFSET $${listValues.length}`,
    listValues,
  );

  const total = countResult.rows[0].total;

  return {
    data: rowsResult.rows.map(mapStudentRow),
    meta: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / normalizedPageSize)),
      filters: {
        search: search ? String(search) : null,
        program: program ? String(program) : null,
        status: status ? String(status) : null,
        language: language ? String(language) : null,
        skill: skill ? String(skill) : null,
      },
      sort: {
        by: normalizedSortBy,
        direction: normalizedSortDir.toLowerCase(),
      },
    },
  };
}

export async function getStudentById(id) {
  const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
  return result.rows[0] ? mapStudentRow(result.rows[0]) : null;
}

export async function getConsentsList() {
  const result = await pool.query('SELECT * FROM consents ORDER BY date DESC, student_name ASC');
  return {
    data: result.rows.map(mapConsentRow),
    meta: {
      total: result.rowCount ?? result.rows.length,
    },
  };
}

export async function getReferenceList(tableName) {
  const result = await pool.query(`SELECT id, code, name FROM ${tableName} ORDER BY name`);
  return {
    data: result.rows.map(mapReferenceRow),
    meta: {
      total: result.rowCount ?? result.rows.length,
    },
  };
}
