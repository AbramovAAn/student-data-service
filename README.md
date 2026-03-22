# Student Data Service

Сервис управления данными студентов для учебного офиса вуза.

## Назначение сервиса

Проект предназначен для хранения, актуализации, поиска и предоставления данных о студентах через пользовательский интерфейс и API.

Сервис не является системой автоматического распределения студентов на практику. Его задача - выступать источником актуальных данных, которые могут использоваться:
- сотрудниками учебного офиса
- внешним сервисом распределения на практику
- сервисом уведомлений
- другими интеграциями, которым нужны данные о студентах

## Связь с задачей распределения студентов на практику

Сервис поддерживает работу с данными, которые важны для последующего отбора и распределения студентов на практику:
- образовательная программа и курс
- средний балл
- языки
- hard skills и soft skills
- практический опыт
- предпочтения по стажировкам и практикам
- согласия на обработку данных

Таким образом, система не принимает решение о распределении, а подготавливает и предоставляет данные для таких решений.

## Стек технологий

- Frontend: `React`, `TypeScript`, `Vite`
- Backend: `Node.js`, `Express`
- База данных: `PostgreSQL`
- Документация API: `Swagger UI`, `OpenAPI`
- Автотесты backend API: `node:test`, `supertest`
- Контейнеризация: `Docker`, `Docker Compose`

## Архитектура

Проект состоит из трех основных частей:
- frontend-приложение для сотрудников учебного офиса
- backend API как самостоятельный сервис доступа к данным
- PostgreSQL как основное хранилище

На высоком уровне взаимодействие выглядит так:
1. Пользователь работает с интерфейсом frontend.
2. Frontend обращается к backend API по HTTP.
3. Backend выполняет бизнес-операции и работает с PostgreSQL.
4. Внешние системы могут использовать публичный API сервиса независимо от frontend.

Основной внешний API документируется через `/api/v1`.

Endpoint `/api/bootstrap` сохранен как legacy-маршрут для совместимости с текущим frontend и не рассматривается как основной публичный интерфейс сервиса.

## Основные возможности

- просмотр списка студентов
- поиск, фильтрация, сортировка и пагинация списка студентов
- просмотр карточки студента
- создание, обновление и удаление студента
- работа со справочниками программ, языков, hard skills и soft skills
- ведение согласий на обработку данных
- сравнение студентов в пользовательском интерфейсе
- предоставление данных через backend API
- Swagger/OpenAPI-документация для основного API

## Локальный запуск

### Требования

- `Node.js`
- `PostgreSQL`

### Подготовка

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` по примеру `.env.example`.

Пример:

```env
PORT=3001
DATABASE_URL=postgresql://student_app:studentapp123@localhost:5432/student_data_service
VITE_API_URL=http://localhost:3001/api
POSTGRES_DB=student_data_service
POSTGRES_USER=student_app
POSTGRES_PASSWORD=studentapp123
FRONTEND_ORIGIN=http://localhost:8080
```

3. Применить миграции:

```bash
npm run db:migrate
```

4. Наполнить базу начальными данными:

```bash
npm run db:seed
```

### Запуск

Запуск backend:

```bash
npm run server
```

Запуск frontend в отдельном терминале:

```bash
npm run dev
```

После запуска обычно доступны:
- frontend: `http://localhost:5173`
- backend API: `http://localhost:3001`
- Swagger UI: `http://localhost:3001/docs`

При необходимости можно использовать и адреса `127.0.0.1` как альтернативу.

Данные для входа в интерфейс:
- логин: `admin`
- пароль: `admin`

## Запуск через Docker

В проекте подготовлены:
- `Dockerfile.frontend`
- `Dockerfile.backend`
- `docker-compose.yml`

Запуск:

```bash
docker compose --project-name student-data-service up -d --build
```

После запуска доступны:
- frontend: `http://localhost:8080`
- backend API: `http://localhost:3001`
- Swagger UI: `http://localhost:3001/docs`
- PostgreSQL на хосте: `localhost:5433`

Для Docker-сценария предпочтительно использовать адреса `localhost`, так как они согласованы с настройками CORS и примерами конфигурации. Адреса `127.0.0.1` также допустимы как альтернативный вариант.

Остановка:

```bash
docker compose --project-name student-data-service down
```

Остановка с удалением volume базы:

```bash
docker compose --project-name student-data-service down -v
```

## Переменные окружения

Основные переменные:

- `PORT` - порт backend API
- `DATABASE_URL` - строка подключения к PostgreSQL
- `VITE_API_URL` - базовый URL API для frontend
- `POSTGRES_DB` - имя базы данных для Docker-сценария
- `POSTGRES_USER` - пользователь PostgreSQL для Docker-сценария
- `POSTGRES_PASSWORD` - пароль пользователя PostgreSQL для Docker-сценария
- `FRONTEND_ORIGIN` - origin frontend для CORS

Актуальный шаблон переменных окружения находится в файле `./.env.example`.

## Команды миграции и сидирования

Применить миграции:

```bash
npm run db:migrate
```

Наполнить базу начальными данными:

```bash
npm run db:seed
```

## Запуск тестов

Проверка TypeScript:

```bash
npm run check
```

Сборка frontend:

```bash
npm run build
```

Минимальный набор автотестов backend API:

```bash
npm run test:api
```

## Swagger / OpenAPI

Основная документация публичного API доступна по адресу:

- Swagger UI: `http://localhost:3001/docs`
- OpenAPI JSON: `http://localhost:3001/openapi.json`

Основной публичный интерфейс сервиса документируется через `/api/v1`.

Примеры endpoint'ов:
- `GET /api/v1/health`
- `GET /api/v1/students`
- `GET /api/v1/students/{id}`
- `POST /api/v1/students`
- `GET /api/v1/consents`
- `GET /api/v1/programs`
- `GET /api/v1/languages`
- `GET /api/v1/skills`
- `GET /api/v1/soft-skills`

## Структура проекта

- `components/` - React-компоненты пользовательского интерфейса
- `server/` - backend API, OpenAPI, миграции и сидирование
- `tests/` - автотесты backend API
- `lib/` - клиент для вызова API с frontend
- `types/` - доменные типы
- `data/` - данные для начального наполнения
- `styles/` - глобальные стили
- `scripts/` - вспомогательные сценарии
- `Dockerfile.frontend` - контейнеризация frontend
- `Dockerfile.backend` - контейнеризация backend
- `docker-compose.yml` - совместный запуск frontend, backend и PostgreSQL

## Примечание по Docker на Windows

Если проект расположен в пути с не-ASCII символами, Docker BuildKit на Windows может работать нестабильно.

Практичный вариант в таком случае:
- запускать `docker compose` из каталога с ASCII-путем
- либо держать рабочую копию проекта в директории без кириллицы в пути
