import React, { useMemo, useState } from 'react';
import { Language, Skill, Student } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { StudentAvatar } from './common/StudentAvatar';
import { ContactInfo } from './common/ContactInfo';
import { SkillChip } from './common/SkillChip';
import { StatusBadge } from './common/StatusBadge';
import { ArrowLeftRight, Award, BookOpen, Code, GitCompare, Target, TrendingUp, Users } from 'lucide-react';

interface ComparePageProps {
  students: Student[];
  languages: Language[];
  skills: Skill[];
  softSkills: Skill[];
}

type TrackKey = 'analytics' | 'backend' | 'frontend';

export function ComparePage({ students, languages, skills, softSkills }: ComparePageProps) {
  const [student1Id, setStudent1Id] = useState('');
  const [student2Id, setStudent2Id] = useState('');

  const student1 = students.find((student) => student.id === student1Id);
  const student2 = students.find((student) => student.id === student2Id);

  const getLanguageName = (code: string) => languages.find((item) => item.code === code)?.name || code;
  const getSkillName = (code: string) => skills.find((item) => item.code === code)?.name || code;
  const getSoftSkillName = (code: string) => softSkills.find((item) => item.code === code)?.name || code;

  const getCommonValues = (left: string[], right: string[]) => left.filter((value) => right.includes(value));
  const getUniqueValues = (left: string[], right: string[]) => left.filter((value) => !right.includes(value));

  const bestFit = useMemo(() => {
    if (!student1 || !student2) return null;

    const scoreTrack = (student: Student, pool: string[]) =>
      student.skills.filter((skill) => pool.includes(skill)).length;

    const trackPools: Record<TrackKey, string[]> = {
      analytics: ['python', 'r', 'data-analysis', 'sql', 'ml', 'tableau'],
      backend: ['java', 'python', 'nodejs', 'sql', 'spring', 'docker'],
      frontend: ['react', 'typescript', 'nodejs'],
    };

    const resolveWinner = (leftScore: number, rightScore: number) => {
      if (leftScore === rightScore) return 'Одинаково';
      return leftScore > rightScore ? student1.fullName : student2.fullName;
    };

    return {
      analytics: {
        winner: resolveWinner(scoreTrack(student1, trackPools.analytics), scoreTrack(student2, trackPools.analytics)),
        scores: [scoreTrack(student1, trackPools.analytics), scoreTrack(student2, trackPools.analytics)],
      },
      backend: {
        winner: resolveWinner(scoreTrack(student1, trackPools.backend), scoreTrack(student2, trackPools.backend)),
        scores: [scoreTrack(student1, trackPools.backend), scoreTrack(student2, trackPools.backend)],
      },
      frontend: {
        winner: resolveWinner(scoreTrack(student1, trackPools.frontend), scoreTrack(student2, trackPools.frontend)),
        scores: [scoreTrack(student1, trackPools.frontend), scoreTrack(student2, trackPools.frontend)],
      },
    };
  }, [student1, student2]);

  const comparisonSummary = useMemo(() => {
    if (!student1 || !student2) return [];

    const summary: string[] = [];

    if (student1.gpa !== student2.gpa) {
      summary.push(
        `${student1.gpa > student2.gpa ? student1.fullName : student2.fullName} показывает более высокий GPA.`,
      );
    }

    if (student1.skills.length !== student2.skills.length) {
      summary.push(
        `${student1.skills.length > student2.skills.length ? student1.fullName : student2.fullName} имеет более широкий технический стек.`,
      );
    }

    if (student1.languages.length !== student2.languages.length) {
      summary.push(
        `${student1.languages.length > student2.languages.length ? student1.fullName : student2.fullName} владеет большим количеством языков.`,
      );
    }

    if (summary.length === 0) {
      summary.push('Профили выглядят сбалансированно: по базовым метрикам студенты очень близки.');
    }

    return summary;
  }, [student1, student2]);

  const swapStudents = () => {
    setStudent1Id(student2Id);
    setStudent2Id(student1Id);
  };

  const clearSelection = () => {
    setStudent1Id('');
    setStudent2Id('');
  };

  const renderChipGroup = (
    values: string[],
    mapLabel: (value: string) => string,
    variant: 'primary' | 'secondary' | 'success' | 'outline',
    emptyLabel: string,
  ) => {
    if (values.length === 0) {
      return <p className="text-sm text-[#5e6c84]">{emptyLabel}</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <SkillChip key={value} label={mapLabel(value)} variant={variant} />
        ))}
      </div>
    );
  };

  const renderMetricRow = (label: string, leftValue: string | number, rightValue: string | number) => (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl bg-[#f4f5f7] p-4">
      <div className="text-left">
        <p className="text-[#172b4d]">{leftValue}</p>
      </div>
      <p className="text-sm text-[#5e6c84] whitespace-nowrap">{label}</p>
      <div className="text-right">
        <p className="text-[#172b4d]">{rightValue}</p>
      </div>
    </div>
  );

  if (students.length < 2) {
    return (
      <Card className="p-12 text-center border-0 shadow-md rounded-2xl bg-white">
        <Users className="w-20 h-20 mx-auto mb-6 text-[#5e6c84]" />
        <h3 className="text-[#172b4d] mb-3">Недостаточно данных для сравнения</h3>
        <p className="text-[#5e6c84]">Добавьте как минимум двух студентов, чтобы включить режим сравнения.</p>
      </Card>
    );
  }

  const commonSkills = student1 && student2 ? getCommonValues(student1.skills, student2.skills) : [];
  const commonLanguages = student1 && student2 ? getCommonValues(student1.languages, student2.languages) : [];
  const commonSoftSkills = student1 && student2 ? getCommonValues(student1.softSkills, student2.softSkills) : [];

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="bg-gradient-to-r from-white to-[#fafbfc] p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#dfe1e6] shadow-sm">
        <h1 className="text-[#172b4d] mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl">Сравнение студентов</h1>
        <p className="text-[#5e6c84] text-sm sm:text-base">
          Сопоставьте сильные стороны, навыки и карьерные предпочтения двух кандидатов.
        </p>
      </div>

      <Card className="p-6 sm:p-8 lg:p-10 border-0 shadow-md rounded-2xl bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 sm:gap-6 items-end">
          <div className="space-y-3">
            <Label>Студент 1</Label>
            <Select value={student1Id} onValueChange={setStudent1Id}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите студента" />
              </SelectTrigger>
              <SelectContent>
                {students
                  .filter((student) => student.id !== student2Id)
                  .map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Студент 2</Label>
            <Select value={student2Id} onValueChange={setStudent2Id}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите студента" />
              </SelectTrigger>
              <SelectContent>
                {students
                  .filter((student) => student.id !== student1Id)
                  .map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={swapStudents} disabled={!student1Id || !student2Id} className="rounded-xl">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Поменять
            </Button>
            <Button variant="outline" onClick={clearSelection} className="rounded-xl">
              Сбросить
            </Button>
          </div>
        </div>
      </Card>

      {(student1 || student2) && !(student1 && student2) && (
        <Card className="p-10 text-center border-0 shadow-md rounded-2xl bg-white">
          <GitCompare className="w-14 h-14 mx-auto mb-5 text-[#5e6c84]" />
          <h3 className="text-[#172b4d] mb-2">Выберите второго студента</h3>
          <p className="text-[#5e6c84]">После этого появится детальное сравнение по навыкам, метрикам и опыту.</p>
        </Card>
      )}

      {student1 && student2 && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {[student1, student2].map((student) => (
              <Card key={student.id} className="p-6 sm:p-8 border-0 shadow-md rounded-2xl bg-white">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-5">
                    <StudentAvatar name={student.fullName} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#172b4d] mb-2">{student.fullName}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <StatusBadge status={student.status} />
                        <SkillChip label={`Курс ${student.course}`} variant="secondary" />
                      </div>
                      <p className="text-sm text-[#5e6c84]">{student.program}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#f4f5f7] p-5">
                    <ContactInfo email={student.email} phone={student.phone} telegram={student.telegram} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 sm:p-8 lg:p-10 border-0 shadow-md rounded-2xl bg-white">
            <h3 className="text-[#172b4d] mb-6 flex items-center gap-2 text-lg sm:text-xl">
              <Award className="w-5 h-5 text-[#0052cc]" />
              Основные показатели
            </h3>
            <div className="space-y-4">
              {renderMetricRow('GPA', student1.gpa.toFixed(1), student2.gpa.toFixed(1))}
              {renderMetricRow('Курс', student1.course, student2.course)}
              {renderMetricRow('Год поступления', student1.yearEnrolled, student2.yearEnrolled)}
              {renderMetricRow('Языков', student1.languages.length, student2.languages.length)}
              {renderMetricRow('Тех. навыков', student1.skills.length, student2.skills.length)}
              {renderMetricRow('Soft skills', student1.softSkills.length, student2.softSkills.length)}
            </div>
          </Card>

          <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#deebff] via-[#e9f2ff] to-[#deebff] border border-[#b3d4ff] shadow-md rounded-2xl">
            <h3 className="text-[#172b4d] mb-5 flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="w-5 h-5 text-[#0052cc]" />
              Короткие выводы
            </h3>
            <div className="space-y-3">
              {comparisonSummary.map((line) => (
                <div key={line} className="rounded-2xl bg-white/85 p-4 text-[#172b4d]">
                  {line}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-6 sm:p-8 border-0 shadow-md rounded-2xl bg-white">
              <h3 className="text-[#172b4d] mb-6 flex items-center gap-2 text-lg sm:text-xl">
                <Code className="w-5 h-5 text-[#0052cc]" />
                Технические навыки
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Общие</p>
                  {renderChipGroup(commonSkills, getSkillName, 'success', 'Общих навыков не найдено.')}
                </div>
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Уникальные у {student1.fullName}</p>
                  {renderChipGroup(
                    getUniqueValues(student1.skills, student2.skills),
                    getSkillName,
                    'primary',
                    'Уникальных навыков нет.',
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Уникальные у {student2.fullName}</p>
                  {renderChipGroup(
                    getUniqueValues(student2.skills, student1.skills),
                    getSkillName,
                    'primary',
                    'Уникальных навыков нет.',
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 border-0 shadow-md rounded-2xl bg-white">
              <h3 className="text-[#172b4d] mb-6 flex items-center gap-2 text-lg sm:text-xl">
                <BookOpen className="w-5 h-5 text-[#0052cc]" />
                Языки
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Общие</p>
                  {renderChipGroup(commonLanguages, getLanguageName, 'success', 'Общих языков нет.')}
                </div>
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Только у {student1.fullName}</p>
                  {renderChipGroup(
                    getUniqueValues(student1.languages, student2.languages),
                    getLanguageName,
                    'outline',
                    'Дополнительных языков нет.',
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Только у {student2.fullName}</p>
                  {renderChipGroup(
                    getUniqueValues(student2.languages, student1.languages),
                    getLanguageName,
                    'outline',
                    'Дополнительных языков нет.',
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 border-0 shadow-md rounded-2xl bg-white">
              <h3 className="text-[#172b4d] mb-6 flex items-center gap-2 text-lg sm:text-xl">
                <Users className="w-5 h-5 text-[#0052cc]" />
                Soft skills
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Общие</p>
                  {renderChipGroup(commonSoftSkills, getSoftSkillName, 'success', 'Совпадающих soft skills нет.')}
                </div>
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Сильные стороны {student1.fullName}</p>
                  {renderChipGroup(
                    getUniqueValues(student1.softSkills, student2.softSkills),
                    getSoftSkillName,
                    'secondary',
                    'Выраженных уникальных soft skills нет.',
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#5e6c84] mb-3">Сильные стороны {student2.fullName}</p>
                  {renderChipGroup(
                    getUniqueValues(student2.softSkills, student1.softSkills),
                    getSoftSkillName,
                    'secondary',
                    'Выраженных уникальных soft skills нет.',
                  )}
                </div>
              </div>
            </Card>
          </div>

          {bestFit && (
            <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#deebff] via-[#e9f2ff] to-[#deebff] border border-[#b3d4ff] shadow-md rounded-2xl">
              <h3 className="text-[#172b4d] mb-6 sm:mb-8 flex items-center gap-2 text-lg sm:text-xl">
                <Target className="w-5 h-5 text-[#0052cc]" />
                Кто лучше подходит для направления
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {(
                  [
                    ['Data Analytics', bestFit.analytics],
                    ['Backend Development', bestFit.backend],
                    ['Frontend Development', bestFit.frontend],
                  ] as [string, { winner: string; scores: [number, number] }][]
                ).map(([title, info]) => (
                  <div key={title} className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-sm text-[#5e6c84] mb-3">{title}</p>
                    <p className="text-[#172b4d] mb-3">{info.winner}</p>
                    <p className="text-xs text-[#5e6c84]">
                      Баллы: {student1.fullName.split(' ')[0]} {info.scores[0]} / {student2.fullName.split(' ')[0]} {info.scores[1]}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {[student1, student2].map((student) => (
              <Card key={student.id} className="p-6 sm:p-8 border-0 shadow-md rounded-2xl bg-white">
                <h4 className="text-[#172b4d] mb-6">Опыт и предпочтения: {student.fullName}</h4>
                <div className="space-y-6">
                  <div>
                    <Label className="text-[#5e6c84] mb-3 block">Практический опыт</Label>
                    <div className="rounded-2xl bg-[#f4f5f7] p-5 text-sm text-[#172b4d] leading-relaxed">
                      {student.practicalExperience}
                    </div>
                  </div>
                  <div>
                    <Label className="text-[#5e6c84] mb-3 block">Пожелания по стажировке</Label>
                    <div className="rounded-2xl bg-[#fff4e6] border-l-4 border-[#ff991f] p-5 text-sm text-[#172b4d]">
                      {student.internshipPreferences}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
