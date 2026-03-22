import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {
  getBootstrapData,
  getConsentsList,
  getReferenceList,
  getStudentById,
  getStudentsList,
  mapConsentRow,
  mapReferenceRow,
  mapStudentRow,
  pool,
} from './db.js';
import { openApiDocument } from './openapi.js';

class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sendData(res, data, meta, status = 200) {
  const payload = { data };
  if (meta) {
    payload.meta = meta;
  }
  res.status(status).json(payload);
}

function normalizeStudentPayload(payload) {
  return {
    fullName: String(payload.fullName ?? '').trim(),
    email: String(payload.email ?? '').trim(),
    phone: String(payload.phone ?? '').trim(),
    telegram: String(payload.telegram ?? '').trim(),
    birthDate: String(payload.birthDate ?? '').trim(),
    program: String(payload.program ?? '').trim(),
    course: Number(payload.course),
    gpa: Number(payload.gpa),
    yearEnrolled: Number(payload.yearEnrolled),
    languages: Array.isArray(payload.languages) ? payload.languages : [],
    skills: Array.isArray(payload.skills) ? payload.skills : [],
    softSkills: Array.isArray(payload.softSkills) ? payload.softSkills : [],
    practicalExperience: String(payload.practicalExperience ?? '').trim(),
    internshipPreferences: String(payload.internshipPreferences ?? '').trim(),
    portfolioUrl: String(payload.portfolioUrl ?? '').trim(),
    status: payload.status,
    note: String(payload.note ?? '').trim(),
    avatar: payload.avatar ? String(payload.avatar) : null,
  };
}

function assertStudentPayload(student) {
  if (!student.fullName || !student.email || !student.birthDate || !student.program) {
    throw new ApiError(400, 'validation_error', 'Missing required student fields');
  }
}

function normalizeConsentPayload(payload) {
  return {
    studentName: String(payload.studentName ?? '').trim(),
    type: String(payload.type ?? '').trim(),
    date: String(payload.date ?? '').trim(),
    status: payload.status,
  };
}

const tableByReferenceType = {
  programs: 'programs',
  languages: 'languages',
  skills: 'skills',
};

export function createApp() {
  const app = express();
  const apiRouter = express.Router();
  const allowedOrigins = [
    process.env.FRONTEND_ORIGIN,
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
  ].filter(Boolean);

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());
  app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
    },
  }));

  apiRouter.get('/health', async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  });

  apiRouter.get('/bootstrap', async (_req, res) => {
    const data = await getBootstrapData();
    res.json(data);
  });

  apiRouter.get('/students', async (req, res) => {
    const result = await getStudentsList({
      search: req.query.search,
      program: req.query.program,
      status: req.query.status,
      language: req.query.language,
      skill: req.query.skill,
      sortBy: req.query.sortBy,
      sortDir: req.query.sortDir,
      page: req.query.page,
      pageSize: req.query.pageSize,
    });

    sendData(res, result.data, result.meta);
  });

  apiRouter.get('/students/:id', async (req, res) => {
    const student = await getStudentById(req.params.id);
    if (!student) {
      throw new ApiError(404, 'student_not_found', 'Student not found');
    }

    sendData(res, student);
  });

  apiRouter.post('/students', async (req, res) => {
    const student = normalizeStudentPayload(req.body);
    assertStudentPayload(student);

    const id = createId();
    const lastUpdated = new Date().toISOString();

    const { rows } = await pool.query(
      `INSERT INTO students (
        id, full_name, email, phone, telegram, birth_date, program, course, gpa, year_enrolled,
        languages, skills, soft_skills, practical_experience, internship_preferences, portfolio_url,
        status, note, avatar, last_updated
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20
      ) RETURNING *`,
      [
        id,
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
        student.note,
        student.avatar,
        lastUpdated,
      ],
    );

    res.status(201).json(mapStudentRow(rows[0]));
  });

  apiRouter.put('/students/:id', async (req, res) => {
    const student = normalizeStudentPayload(req.body);
    assertStudentPayload(student);

    const lastUpdated = new Date().toISOString();
    const { rows } = await pool.query(
      `UPDATE students SET
        full_name = $2,
        email = $3,
        phone = $4,
        telegram = $5,
        birth_date = $6,
        program = $7,
        course = $8,
        gpa = $9,
        year_enrolled = $10,
        languages = $11,
        skills = $12,
        soft_skills = $13,
        practical_experience = $14,
        internship_preferences = $15,
        portfolio_url = $16,
        status = $17,
        note = $18,
        avatar = $19,
        last_updated = $20
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id,
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
        student.note,
        student.avatar,
        lastUpdated,
      ],
    );

    if (rows.length === 0) {
      throw new ApiError(404, 'student_not_found', 'Student not found');
    }

    res.json(mapStudentRow(rows[0]));
  });

  apiRouter.delete('/students/:id', async (req, res) => {
    const { rowCount } = await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    if (rowCount === 0) {
      throw new ApiError(404, 'student_not_found', 'Student not found');
    }

    res.status(204).send();
  });

  apiRouter.get('/consents', async (_req, res) => {
    const result = await getConsentsList();
    sendData(res, result.data, result.meta);
  });

  apiRouter.post('/consents', async (req, res) => {
    const consent = normalizeConsentPayload(req.body);
    if (!consent.studentName || !consent.type || !consent.date) {
      throw new ApiError(400, 'validation_error', 'Missing required consent fields');
    }

    const { rows } = await pool.query(
      'INSERT INTO consents (id, student_name, type, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [createId(), consent.studentName, consent.type, consent.date, consent.status],
    );

    res.status(201).json(mapConsentRow(rows[0]));
  });

  apiRouter.put('/consents/:id', async (req, res) => {
    const consent = normalizeConsentPayload(req.body);
    const { rows } = await pool.query(
      'UPDATE consents SET student_name = $2, type = $3, date = $4, status = $5 WHERE id = $1 RETURNING *',
      [req.params.id, consent.studentName, consent.type, consent.date, consent.status],
    );

    if (rows.length === 0) {
      throw new ApiError(404, 'consent_not_found', 'Consent not found');
    }

    res.json(mapConsentRow(rows[0]));
  });

  apiRouter.get('/programs', async (_req, res) => {
    const result = await getReferenceList('programs');
    sendData(res, result.data, result.meta);
  });

  apiRouter.get('/languages', async (_req, res) => {
    const result = await getReferenceList('languages');
    sendData(res, result.data, result.meta);
  });

  apiRouter.get('/skills', async (_req, res) => {
    const result = await getReferenceList('skills');
    sendData(res, result.data, result.meta);
  });

  apiRouter.get('/soft-skills', async (_req, res) => {
    const result = await getReferenceList('soft_skills');
    sendData(res, result.data, result.meta);
  });

  apiRouter.post('/references/:type', async (req, res) => {
    const tableName = tableByReferenceType[req.params.type];
    if (!tableName) {
      throw new ApiError(404, 'reference_type_not_found', 'Unknown reference type');
    }

    const code = String(req.body.code ?? '').trim();
    const name = String(req.body.name ?? '').trim();
    if (!code || !name) {
      throw new ApiError(400, 'validation_error', 'Missing required reference fields');
    }

    const { rows } = await pool.query(
      `INSERT INTO ${tableName} (id, code, name) VALUES ($1, $2, $3) RETURNING *`,
      [createId(), code, name],
    );

    res.status(201).json(mapReferenceRow(rows[0]));
  });

  apiRouter.delete('/references/:type/:id', async (req, res) => {
    const tableName = tableByReferenceType[req.params.type];
    if (!tableName) {
      throw new ApiError(404, 'reference_type_not_found', 'Unknown reference type');
    }

    const { rowCount } = await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [req.params.id]);
    if (rowCount === 0) {
      throw new ApiError(404, 'reference_not_found', 'Reference item not found');
    }

    res.status(204).send();
  });

  app.use('/api', apiRouter);
  app.use('/api/v1', apiRouter);

  app.use((error, _req, res, _next) => {
    console.error(error);

    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return res.status(409).json({
        error: {
          code: 'duplicate_entity',
          message: 'A record with the same unique fields already exists',
        },
      });
    }

    if (error instanceof ApiError) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
    }

    return res.status(500).json({
      error: {
        code: 'internal_server_error',
        message: error?.message || 'Internal server error',
      },
    });
  });

  return app;
}
