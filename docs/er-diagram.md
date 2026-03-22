# ER-диаграмма базы данных

## Описание

Текущая база данных включает таблицы студентов, согласий и справочников. Справочники используются как источники допустимых значений, однако в текущей реализации данные студента хранятся в основном в денормализованном виде: часть полей записывается как строки или массивы строк, а не как внешние ключи.

Это соответствует текущей реализации проекта и упрощает демонстрационный сценарий.

## ER-диаграмма

```mermaid
erDiagram
    STUDENTS {
        text id PK
        text full_name
        text email
        text phone
        text telegram
        text birth_date
        text program
        int course
        numeric gpa
        int year_enrolled
        text[] languages
        text[] skills
        text[] soft_skills
        text practical_experience
        text internship_preferences
        text portfolio_url
        text status
        text note
        text avatar
        text last_updated
    }

    CONSENTS {
        text id PK
        text student_name
        text type
        text date
        text status
    }

    PROGRAMS {
        text id PK
        text code UK
        text name
    }

    LANGUAGES {
        text id PK
        text code UK
        text name
    }

    SKILLS {
        text id PK
        text code UK
        text name
    }

    SOFT_SKILLS {
        text id PK
        text code UK
        text name
    }

    PROGRAMS ||..o{ STUDENTS : "используется как справочник"
    LANGUAGES ||..o{ STUDENTS : "значения хранятся в массиве codes"
    SKILLS ||..o{ STUDENTS : "значения хранятся в массиве codes"
    SOFT_SKILLS ||..o{ STUDENTS : "значения хранятся в массиве codes"
    STUDENTS ||..o{ CONSENTS : "логическая связь по student_name"
```

## Практические замечания

- таблица `students` является центральной сущностью сервиса
- таблица `consents` хранит согласия студентов на обработку данных
- таблицы `programs`, `languages`, `skills`, `soft_skills` являются справочниками
- в текущей версии между `students` и `consents` нет физического внешнего ключа, связь носит логический характер
- в текущей версии `program`, `languages`, `skills` и `soft_skills` в записи студента не реализованы как внешние ключи на отдельные таблицы
