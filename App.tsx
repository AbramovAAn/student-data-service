import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ComparePage } from './components/ComparePage';
import { ConsentsPage } from './components/ConsentsPage';
import { DashboardPage } from './components/DashboardPage';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { ReferencesPage } from './components/ReferencesPage';
import { StudentsPage } from './components/StudentsPage';
import { Toaster } from './components/ui/sonner';
import { api } from './lib/api';
import { Consent, Language, Program, Skill, Student } from './types';

type Page = 'dashboard' | 'students' | 'compare' | 'references' | 'consents';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [softSkills, setSoftSkills] = useState<Skill[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const data = await api.getBootstrap();
        if (cancelled) return;

        setStudents(data.students);
        setPrograms(data.programs);
        setLanguages(data.languages);
        setSkills(data.skills);
        setSoftSkills(data.softSkills);
        setConsents(data.consents);
      } catch (error) {
        if (!cancelled) {
          toast.error('Не удалось загрузить данные', {
            description: error instanceof Error ? error.message : 'Неизвестная ошибка',
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast.success('Успешный вход в систему', {
      description: 'Добро пожаловать в Student Data Service',
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setSelectedStudentId(null);
    setStudents([]);
    setPrograms([]);
    setLanguages([]);
    setSkills([]);
    setSoftSkills([]);
    setConsents([]);
    toast.info('Вы вышли из системы');
  };

  const handleError = (message: string) => {
    toast.error('Ошибка входа', {
      description: message,
    });
  };

  const handleNavigateToStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentPage('students');
  };

  const handleAddStudent = async (student: Omit<Student, 'id' | 'lastUpdated'>) => {
    try {
      const createdStudent = await api.createStudent(student);
      setStudents((prev) => [createdStudent, ...prev]);
      toast.success('Студент добавлен');
    } catch (error) {
      toast.error('Не удалось добавить студента', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      const savedStudent = await api.updateStudent(updatedStudent);
      setStudents((prev) => prev.map((student) => (student.id === savedStudent.id ? savedStudent : student)));
      toast.success('Данные студента обновлены');
    } catch (error) {
      toast.error('Не удалось обновить студента', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await api.deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
      toast.success('Студент удалён');
    } catch (error) {
      toast.error('Не удалось удалить студента', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleAddProgram = async (program: Omit<Program, 'id'>) => {
    try {
      const newProgram = (await api.createReference('programs', program)) as Program;
      setPrograms((prev) => [...prev, newProgram]);
      toast.success('Программа добавлена');
    } catch (error) {
      toast.error('Не удалось добавить программу', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleAddLanguage = async (language: Omit<Language, 'id'>) => {
    try {
      const newLanguage = (await api.createReference('languages', language)) as Language;
      setLanguages((prev) => [...prev, newLanguage]);
      toast.success('Язык добавлен');
    } catch (error) {
      toast.error('Не удалось добавить язык', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleAddSkill = async (skill: Omit<Skill, 'id'>) => {
    try {
      const newSkill = (await api.createReference('skills', skill)) as Skill;
      setSkills((prev) => [...prev, newSkill]);
      toast.success('Навык добавлен');
    } catch (error) {
      toast.error('Не удалось добавить навык', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await api.deleteReference('programs', id);
      setPrograms((prev) => prev.filter((program) => program.id !== id));
      toast.success('Программа удалена');
    } catch (error) {
      toast.error('Не удалось удалить программу', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    try {
      await api.deleteReference('languages', id);
      setLanguages((prev) => prev.filter((language) => language.id !== id));
      toast.success('Язык удалён');
    } catch (error) {
      toast.error('Не удалось удалить язык', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.deleteReference('skills', id);
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
      toast.success('Навык удалён');
    } catch (error) {
      toast.error('Не удалось удалить навык', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleUpdateConsent = async (updatedConsent: Consent) => {
    try {
      const savedConsent = await api.updateConsent(updatedConsent);
      setConsents((prev) => prev.map((consent) => (consent.id === savedConsent.id ? savedConsent : consent)));
      toast.success('Статус согласия обновлён');
    } catch (error) {
      toast.error('Не удалось обновить согласие', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  const handleAddConsent = async (consent: Omit<Consent, 'id'>) => {
    try {
      const newConsent = await api.createConsent(consent);
      setConsents((prev) => [newConsent, ...prev]);
      toast.success('Согласие добавлено');
    } catch (error) {
      toast.error('Не удалось добавить согласие', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} onError={handleError} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as Page)} onLogout={handleLogout}>
        {currentPage === 'dashboard' && (
          <DashboardPage
            students={students}
            skills={skills}
            isLoading={isLoading}
            onNavigateToStudent={handleNavigateToStudent}
          />
        )}

        {currentPage === 'students' && (
          <StudentsPage
            students={students}
            programs={programs}
            languages={languages}
            skills={skills}
            softSkills={softSkills}
            initialSelectedStudentId={selectedStudentId}
            onInitialStudentHandled={() => setSelectedStudentId(null)}
            isLoading={isLoading}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {currentPage === 'compare' && (
          <ComparePage students={students} languages={languages} skills={skills} softSkills={softSkills} />
        )}

        {currentPage === 'references' && (
          <ReferencesPage
            programs={programs}
            languages={languages}
            skills={skills}
            onAddProgram={handleAddProgram}
            onAddLanguage={handleAddLanguage}
            onAddSkill={handleAddSkill}
            onDeleteProgram={handleDeleteProgram}
            onDeleteLanguage={handleDeleteLanguage}
            onDeleteSkill={handleDeleteSkill}
          />
        )}

        {currentPage === 'consents' && (
          <ConsentsPage
            consents={consents}
            students={students}
            onAddConsent={handleAddConsent}
            onUpdateConsent={handleUpdateConsent}
          />
        )}
      </Layout>
      <Toaster position="top-right" richColors />
    </>
  );
}
