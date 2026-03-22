export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Student Data Service API',
    version: '1.0.0',
    description: [
      'Самостоятельный сервис управления данными студентов для учебного офиса вуза.',
      'Основной публичный интерфейс сервиса документируется через `/api/v1`.',
      'Endpoint `/api/bootstrap` сохранён только как legacy-маршрут для совместимости с текущим frontend и не считается основным внешним API.',
    ].join('\n\n'),
  },
  servers: [
    {
      url: 'http://127.0.0.1:3001/api/v1',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Проверка доступности сервиса' },
    { name: 'Students', description: 'Управление данными студентов' },
    { name: 'Consents', description: 'Управление согласиями студентов' },
    { name: 'References', description: 'Справочники сервиса' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Проверка доступности API',
        operationId: 'getHealth',
        responses: {
          200: {
            description: 'Сервис доступен',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
          500: {
            description: 'Внутренняя ошибка',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/students': {
      get: {
        tags: ['Students'],
        summary: 'Получить список студентов',
        operationId: 'getStudents',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Поиск по ФИО, email или telegram' },
          { name: 'program', in: 'query', schema: { type: 'string' }, description: 'Фильтр по программе' },
          { name: 'status', in: 'query', schema: { $ref: '#/components/schemas/StudentStatus' }, description: 'Фильтр по статусу' },
          { name: 'language', in: 'query', schema: { type: 'string' }, description: 'Фильтр по коду языка' },
          { name: 'skill', in: 'query', schema: { type: 'string' }, description: 'Фильтр по коду технического навыка' },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['fullName', 'email', 'program', 'course', 'gpa', 'yearEnrolled', 'status', 'lastUpdated'] }, description: 'Поле сортировки' },
          { name: 'sortDir', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] }, description: 'Направление сортировки' },
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: 'Номер страницы' },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }, description: 'Размер страницы' },
        ],
        responses: {
          200: {
            description: 'Список студентов',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StudentsListResponse' },
              },
            },
          },
          500: {
            description: 'Внутренняя ошибка',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Students'],
        summary: 'Создать студента',
        operationId: 'createStudent',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StudentWriteRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Студент создан',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          400: {
            description: 'Ошибка валидации',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Конфликт уникальных данных',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/students/{id}': {
      get: {
        tags: ['Students'],
        summary: 'Получить одного студента по id',
        operationId: 'getStudentById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Идентификатор студента',
          },
        ],
        responses: {
          200: {
            description: 'Данные студента',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StudentResponse' },
              },
            },
          },
          404: {
            description: 'Студент не найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Students'],
        summary: 'Обновить данные студента',
        operationId: 'updateStudent',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Идентификатор студента',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StudentWriteRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Студент обновлён',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          400: {
            description: 'Ошибка валидации',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Студент не найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Конфликт уникальных данных',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Students'],
        summary: 'Удалить студента',
        operationId: 'deleteStudent',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Идентификатор студента',
          },
        ],
        responses: {
          204: {
            description: 'Студент удалён',
          },
          404: {
            description: 'Студент не найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/consents': {
      get: {
        tags: ['Consents'],
        summary: 'Получить список согласий',
        operationId: 'getConsents',
        responses: {
          200: {
            description: 'Список согласий',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ConsentsListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Consents'],
        summary: 'Создать согласие',
        operationId: 'createConsent',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConsentWriteRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Согласие создано',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Consent' },
              },
            },
          },
          400: {
            description: 'Ошибка валидации',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/consents/{id}': {
      put: {
        tags: ['Consents'],
        summary: 'Обновить согласие',
        operationId: 'updateConsent',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Идентификатор согласия',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConsentWriteRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Согласие обновлено',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Consent' },
              },
            },
          },
          404: {
            description: 'Согласие не найдено',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/programs': {
      get: {
        tags: ['References'],
        summary: 'Получить список программ',
        operationId: 'getPrograms',
        responses: {
          200: {
            description: 'Список программ',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReferenceListResponse' },
              },
            },
          },
        },
      },
    },
    '/languages': {
      get: {
        tags: ['References'],
        summary: 'Получить список языков',
        operationId: 'getLanguages',
        responses: {
          200: {
            description: 'Список языков',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReferenceListResponse' },
              },
            },
          },
        },
      },
    },
    '/skills': {
      get: {
        tags: ['References'],
        summary: 'Получить список технических навыков',
        operationId: 'getSkills',
        responses: {
          200: {
            description: 'Список навыков',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReferenceListResponse' },
              },
            },
          },
        },
      },
    },
    '/soft-skills': {
      get: {
        tags: ['References'],
        summary: 'Получить список soft skills',
        operationId: 'getSoftSkills',
        responses: {
          200: {
            description: 'Список soft skills',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReferenceListResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
        },
        required: ['ok'],
      },
      StudentStatus: {
        type: 'string',
        enum: ['Active', 'Graduated', 'On leave'],
      },
      ConsentStatus: {
        type: 'string',
        enum: ['Active', 'Revoked'],
      },
      ReferenceItem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          code: { type: 'string', example: 'DS' },
          name: { type: 'string', example: 'Data Science' },
        },
        required: ['id', 'code', 'name'],
      },
      Student: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'student-1' },
          fullName: { type: 'string', example: 'Иванов Иван Иванович' },
          email: { type: 'string', format: 'email', example: 'i.ivanov@edu.hse.ru' },
          phone: { type: 'string', example: '+7 (999) 123-45-67' },
          telegram: { type: 'string', example: '@ivanov_ivan' },
          birthDate: { type: 'string', format: 'date', example: '2003-05-15' },
          program: { type: 'string', example: 'Прикладная математика и информатика' },
          course: { type: 'integer', example: 3 },
          gpa: { type: 'number', format: 'float', example: 4.5 },
          yearEnrolled: { type: 'integer', example: 2022 },
          languages: { type: 'array', items: { type: 'string' }, example: ['ru', 'en'] },
          skills: { type: 'array', items: { type: 'string' }, example: ['python', 'sql'] },
          softSkills: { type: 'array', items: { type: 'string' }, example: ['communication', 'teamwork'] },
          practicalExperience: { type: 'string', example: 'Опыт участия в проектной деятельности и стажировках.' },
          internshipPreferences: { type: 'string', example: 'data analytics, backend development' },
          portfolioUrl: { type: 'string', format: 'uri', example: 'https://github.com/student' },
          status: { $ref: '#/components/schemas/StudentStatus' },
          note: { type: 'string', example: 'Внутренняя заметка учебного офиса.' },
          avatar: { type: 'string', nullable: true, example: null },
          lastUpdated: { type: 'string', format: 'date-time', example: '2026-03-20T10:00:00.000Z' },
        },
        required: [
          'id',
          'fullName',
          'email',
          'phone',
          'telegram',
          'birthDate',
          'program',
          'course',
          'gpa',
          'yearEnrolled',
          'languages',
          'skills',
          'softSkills',
          'practicalExperience',
          'internshipPreferences',
          'portfolioUrl',
          'status',
          'note',
        ],
      },
      StudentWriteRequest: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          telegram: { type: 'string' },
          birthDate: { type: 'string', format: 'date' },
          program: { type: 'string' },
          course: { type: 'integer' },
          gpa: { type: 'number', format: 'float' },
          yearEnrolled: { type: 'integer' },
          languages: { type: 'array', items: { type: 'string' } },
          skills: { type: 'array', items: { type: 'string' } },
          softSkills: { type: 'array', items: { type: 'string' } },
          practicalExperience: { type: 'string' },
          internshipPreferences: { type: 'string' },
          portfolioUrl: { type: 'string', format: 'uri' },
          status: { $ref: '#/components/schemas/StudentStatus' },
          note: { type: 'string' },
          avatar: { type: 'string', nullable: true },
        },
        required: ['fullName', 'email', 'birthDate', 'program'],
      },
      Consent: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'consent-1' },
          studentName: { type: 'string', example: 'Иванов Иван Иванович' },
          type: { type: 'string', example: 'Обработка персональных данных' },
          date: { type: 'string', format: 'date', example: '2024-09-01' },
          status: { $ref: '#/components/schemas/ConsentStatus' },
        },
        required: ['id', 'studentName', 'type', 'date', 'status'],
      },
      ConsentWriteRequest: {
        type: 'object',
        properties: {
          studentName: { type: 'string' },
          type: { type: 'string' },
          date: { type: 'string', format: 'date' },
          status: { $ref: '#/components/schemas/ConsentStatus' },
        },
        required: ['studentName', 'type', 'date', 'status'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'student_not_found' },
              message: { type: 'string', example: 'Student not found' },
              details: { nullable: true },
            },
            required: ['code', 'message'],
          },
        },
        required: ['error'],
      },
      StudentResponse: {
        type: 'object',
        properties: {
          data: { $ref: '#/components/schemas/Student' },
        },
        required: ['data'],
      },
      StudentsListResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Student' },
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              pageSize: { type: 'integer', example: 20 },
              total: { type: 'integer', example: 50 },
              totalPages: { type: 'integer', example: 3 },
              filters: {
                type: 'object',
                properties: {
                  search: { type: 'string', nullable: true },
                  program: { type: 'string', nullable: true },
                  status: { type: 'string', nullable: true },
                  language: { type: 'string', nullable: true },
                  skill: { type: 'string', nullable: true },
                },
              },
              sort: {
                type: 'object',
                properties: {
                  by: { type: 'string', example: 'lastUpdated' },
                  direction: { type: 'string', example: 'desc' },
                },
                required: ['by', 'direction'],
              },
            },
            required: ['page', 'pageSize', 'total', 'totalPages', 'filters', 'sort'],
          },
        },
        required: ['data', 'meta'],
      },
      ConsentsListResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Consent' },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 8 },
            },
            required: ['total'],
          },
        },
        required: ['data', 'meta'],
      },
      ReferenceListResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/ReferenceItem' },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 4 },
            },
            required: ['total'],
          },
        },
        required: ['data', 'meta'],
      },
    },
  },
};
