import React, { useEffect, useMemo, useState } from 'react';
import { Language, Program, Skill, Student, SortConfig } from '../types';
import { StudentModal } from './StudentModal';
import { MobileStudentCard } from './MobileStudentCard';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Checkbox } from './ui/checkbox';
import { Search, ChevronLeft, ChevronRight, Users, ArrowUpDown, ArrowUp, ArrowDown, Filter, Plus } from 'lucide-react';
import { SkillChip } from './common/SkillChip';
import { StatusBadge } from './common/StatusBadge';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface StudentsPageProps {
  students: Student[];
  programs: Program[];
  languages: Language[];
  skills: Skill[];
  softSkills: Skill[];
  initialSelectedStudentId?: string | null;
  onInitialStudentHandled?: () => void;
  isLoading: boolean;
  onAddStudent: (student: Omit<Student, 'id' | 'lastUpdated'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentsPage({ students, programs, languages, skills, softSkills, initialSelectedStudentId, onInitialStudentHandled, isLoading, onAddStudent, onUpdateStudent, onDeleteStudent }: StudentsPageProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 10;
  const availablePrograms = useMemo(
    () => (programs.length > 0 ? programs.map((program) => program.name) : Array.from(new Set(students.map((student) => student.program)))),
    [programs, students],
  );
  const createEmptyStudent = (): Omit<Student, 'id' | 'lastUpdated'> => ({
    fullName: '',
    email: '',
    phone: '',
    telegram: '',
    birthDate: '',
    program: availablePrograms[0] || '',
    course: 1,
    gpa: 4.0,
    yearEnrolled: new Date().getFullYear(),
    languages: [],
    skills: [],
    softSkills: [],
    practicalExperience: '',
    internshipPreferences: '',
    portfolioUrl: '',
    status: 'Active',
    note: '',
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id' | 'lastUpdated'>>(() => ({
    fullName: '',
    email: '',
    phone: '',
    telegram: '',
    birthDate: '',
    program: '',
    course: 1,
    gpa: 4.0,
    yearEnrolled: new Date().getFullYear(),
    languages: [],
    skills: [],
    softSkills: [],
    practicalExperience: '',
    internshipPreferences: '',
    portfolioUrl: '',
    status: 'Active',
    note: '',
  }));

  const handleSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Student) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-[#5e6c84]" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-4 h-4 text-[#0052cc]" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="w-4 h-4 text-[#0052cc]" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-[#5e6c84]" />;
  };

  const filteredAndSortedStudents = useMemo(() => {
    let result = students.filter((student) => {
      const matchesSearch = student.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProgram = programFilter === 'all' || student.program === programFilter;
      const matchesLanguage = languageFilter === 'all' || student.languages.includes(languageFilter);
      const matchesSkill = skillFilter === 'all' || student.skills.includes(skillFilter);
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      
      return matchesSearch && matchesProgram && matchesLanguage && matchesSkill && matchesStatus;
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      const sortKey = sortConfig.key;

      result.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const comparison = String(aValue).localeCompare(String(bValue), 'ru');
        if (comparison < 0) return sortConfig.direction === 'asc' ? -1 : 1;
        if (comparison > 0) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [students, searchQuery, programFilter, languageFilter, skillFilter, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
  const paginatedStudents = filteredAndSortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniquePrograms = availablePrograms;

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedStudents.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const getSkillName = (code: string) => {
    return skills.find(s => s.code === code)?.name || code;
  };

  const toggleStudentSelection = (field: 'languages' | 'skills' | 'softSkills', value: string) => {
    setNewStudent((prev) => {
      const currentValues = prev[field];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [field]: nextValues,
      };
    });
  };

  const handleOpenAddDialog = () => {
    setNewStudent(createEmptyStudent());
    setIsAddDialogOpen(true);
  };

  const handleCreateStudent = () => {
    if (!newStudent.fullName.trim() || !newStudent.email.trim() || !newStudent.program || !newStudent.birthDate) {
      return;
    }

    onAddStudent({
      ...newStudent,
      fullName: newStudent.fullName.trim(),
      email: newStudent.email.trim(),
      phone: newStudent.phone.trim(),
      telegram: newStudent.telegram.trim(),
      practicalExperience: newStudent.practicalExperience.trim(),
      internshipPreferences: newStudent.internshipPreferences.trim(),
      portfolioUrl: newStudent.portfolioUrl.trim(),
      note: newStudent.note?.trim() || '',
    });

    setIsAddDialogOpen(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!initialSelectedStudentId) return;

    const studentToOpen = students.find(student => student.id === initialSelectedStudentId);
    if (studentToOpen) {
      setSelectedStudent(studentToOpen);
      onInitialStudentHandled?.();
    }
  }, [initialSelectedStudentId, onInitialStudentHandled, students]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white to-[#fafbfc] p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#dfe1e6] shadow-sm">
        <div>
          <h1 className="text-[#172b4d] mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl">Студенты</h1>
          <p className="text-[#5e6c84] text-sm sm:text-base">Управление данными студентов</p>
        </div>
        <Button
          onClick={handleOpenAddDialog}
          className="bg-gradient-to-r from-[#0052cc] to-[#0747a6] hover:from-[#0747a6] hover:to-[#0052cc] shadow-lg hover:shadow-xl transition-all rounded-xl px-4 sm:px-6 py-4 sm:py-6 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить студента
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 sm:p-6 lg:p-8 border-0 shadow-md rounded-2xl bg-white">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search - Always visible */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5e6c84]" />
            <Input
              placeholder="Поиск по ФИО..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-3 sm:gap-4">
            <Select value={programFilter} onValueChange={(value) => {
              setProgramFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Программа" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все программы</SelectItem>
                {uniquePrograms.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={languageFilter} onValueChange={(value) => {
              setLanguageFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Язык" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все языки</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={skillFilter} onValueChange={(value) => {
              setSkillFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Навык" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все навыки</SelectItem>
                {skills.map((skill) => (
                  <SelectItem key={skill.code} value={skill.code}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="Active">Активные</SelectItem>
                <SelectItem value="Graduated">Выпускники</SelectItem>
                <SelectItem value="On leave">В отпуске</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden rounded-xl">
                <Filter className="w-5 h-5 mr-2" />
                Фильтры
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-[#5e6c84] mb-2 block">Программа</label>
                  <Select value={programFilter} onValueChange={(value) => {
                    setProgramFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Программа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все программы</SelectItem>
                      {uniquePrograms.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#5e6c84] mb-2 block">Язык</label>
                  <Select value={languageFilter} onValueChange={(value) => {
                    setLanguageFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Язык" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все языки</SelectItem>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#5e6c84] mb-2 block">Навык</label>
                  <Select value={skillFilter} onValueChange={(value) => {
                    setSkillFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Навык" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все навыки</SelectItem>
                      {skills.map((skill) => (
                        <SelectItem key={skill.code} value={skill.code}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-[#5e6c84] mb-2 block">Статус</label>
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="Active">Активные</SelectItem>
                      <SelectItem value="Graduated">Выпускники</SelectItem>
                      <SelectItem value="On leave">В отпуске</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-gradient-to-r from-[#0052cc] to-[#0747a6] rounded-xl"
                >
                  Применить
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {selectedIds.size > 0 && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-[#deebff] to-[#e9f2ff] rounded-2xl flex items-center justify-between border border-[#b3d4ff]">
            <p className="text-sm text-[#0052cc]">Выбрано студентов: {selectedIds.size}</p>
            <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())} className="rounded-xl">
              Снять выделение
            </Button>
          </div>
        )}
      </Card>

      {students.length === 0 ? (
        <Card className="p-16 text-center border-0 shadow-md rounded-2xl bg-white">
          <Users className="w-20 h-20 mx-auto mb-6 text-[#5e6c84]" />
          <h3 className="text-[#172b4d] mb-3">Студентов пока нет</h3>
          <p className="text-[#5e6c84]">Добавьте первого студента, чтобы заполнить каталог и открыть сравнение.</p>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="overflow-hidden border-0 shadow-md rounded-2xl bg-white hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedIds.size === paginatedStudents.length && paginatedStudents.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('fullName')}
                        className="flex items-center gap-2 hover:text-[#0052cc] transition-colors"
                      >
                        ФИО
                        {getSortIcon('fullName')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('program')}
                        className="flex items-center gap-2 hover:text-[#0052cc] transition-colors"
                      >
                        Программа
                        {getSortIcon('program')}
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button
                        onClick={() => handleSort('course')}
                        className="flex items-center gap-2 hover:text-[#0052cc] transition-colors mx-auto"
                      >
                        Курс
                        {getSortIcon('course')}
                      </button>
                    </TableHead>
                    <TableHead className="text-center">
                      <button
                        onClick={() => handleSort('gpa')}
                        className="flex items-center gap-2 hover:text-[#0052cc] transition-colors mx-auto"
                      >
                        GPA
                        {getSortIcon('gpa')}
                      </button>
                    </TableHead>
                    <TableHead>Навыки</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-[#5e6c84]">
                        Студенты не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStudents.map((student) => (
                      <TableRow 
                        key={student.id}
                        className="cursor-pointer hover:bg-[#f4f5f7] transition-colors"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('.checkbox-cell')) return;
                          setSelectedStudent(student);
                        }}
                      >
                        <TableCell className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.has(student.id)}
                            onCheckedChange={() => toggleSelect(student.id)}
                          />
                        </TableCell>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell className="max-w-[300px]">
                          <span className="text-sm">{student.program}</span>
                        </TableCell>
                        <TableCell className="text-center">{student.course}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 rounded-lg ${
                            student.gpa >= 4.5 ? 'bg-[#e3fcef] text-[#006644]' :
                            student.gpa >= 4.0 ? 'bg-[#deebff] text-[#0052cc]' :
                            'bg-[#f4f5f7] text-[#5e6c84]'
                          }`}>
                            {student.gpa.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 3).map((skill) => (
                              <SkillChip key={skill} label={getSkillName(skill)} variant="outline" />
                            ))}
                            {student.skills.length > 3 && (
                              <SkillChip label={`+${student.skills.length - 3}`} variant="secondary" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={student.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#dfe1e6] px-10 py-8 bg-gradient-to-r from-[#fafbfc] to-white">
                <p className="text-sm text-[#5e6c84]">
                  Показано {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedStudents.length)} из {filteredAndSortedStudents.length}
                </p>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-xl"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Назад
                  </Button>
                  
                  <span className="text-sm text-[#172b4d] px-6 py-2 bg-white rounded-xl border border-[#dfe1e6]">
                    Страница {currentPage} из {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-xl"
                  >
                    Далее
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Mobile List */}
          <div className="md:hidden space-y-4">
            {paginatedStudents.map((student) => (
              <MobileStudentCard
                key={student.id}
                student={student}
                skills={skills}
                onClick={() => setSelectedStudent(student)}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4 sm:p-6 lg:p-8 border-0 shadow-md rounded-2xl bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#5e6c84] text-center sm:text-left">
              Показано {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredAndSortedStudents.length)} из {filteredAndSortedStudents.length}
            </p>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
              
              <span className="text-sm text-[#172b4d] px-4 sm:px-6 py-2 bg-white rounded-xl border border-[#dfe1e6]">
                {currentPage} / {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl"
              >
                <span className="hidden sm:inline">Далее</span>
                <ChevronRight className="w-4 h-4 sm:ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить студента</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">ФИО</Label>
                <Input
                  id="fullName"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Например: Иванов Иван Иванович"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="student@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    value={newStudent.telegram}
                    onChange={(e) => setNewStudent((prev) => ({ ...prev, telegram: e.target.value }))}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Программа</Label>
                  <Select
                    value={newStudent.program}
                    onValueChange={(value) => setNewStudent((prev) => ({ ...prev, program: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите программу" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePrograms.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <Select
                    value={newStudent.status}
                    onValueChange={(value: Student['status']) => setNewStudent((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Активный</SelectItem>
                      <SelectItem value="Graduated">Выпускник</SelectItem>
                      <SelectItem value="On leave">В отпуске</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Дата рождения</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={newStudent.birthDate}
                    onChange={(e) => setNewStudent((prev) => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Курс</Label>
                  <Input
                    id="course"
                    type="number"
                    min="1"
                    max="6"
                    value={newStudent.course}
                    onChange={(e) => setNewStudent((prev) => ({ ...prev, course: Number(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newStudent.gpa}
                    onChange={(e) => setNewStudent((prev) => ({ ...prev, gpa: Number(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearEnrolled">Год поступления</Label>
                <Input
                  id="yearEnrolled"
                  type="number"
                  min="2015"
                  max="2100"
                  value={newStudent.yearEnrolled}
                  onChange={(e) => setNewStudent((prev) => ({ ...prev, yearEnrolled: Number(e.target.value) || new Date().getFullYear() }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Портфолио</Label>
                <Input
                  id="portfolioUrl"
                  value={newStudent.portfolioUrl}
                  onChange={(e) => setNewStudent((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Практический опыт</Label>
                <Textarea
                  id="experience"
                  value={newStudent.practicalExperience}
                  onChange={(e) => setNewStudent((prev) => ({ ...prev, practicalExperience: e.target.value }))}
                  placeholder="Кратко опишите опыт"
                  className="min-h-28"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Пожелания по стажировке</Label>
                <Textarea
                  id="preferences"
                  value={newStudent.internshipPreferences}
                  onChange={(e) => setNewStudent((prev) => ({ ...prev, internshipPreferences: e.target.value }))}
                  placeholder="Например: frontend, analytics, backend"
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Заметка</Label>
                <Textarea
                  id="note"
                  value={newStudent.note || ''}
                  onChange={(e) => setNewStudent((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="Внутренняя заметка"
                  className="min-h-24"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Языки</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-[#dfe1e6] p-4">
                  {languages.map((language) => (
                    <label key={language.code} className="flex items-center gap-3 text-sm text-[#172b4d]">
                      <Checkbox
                        checked={newStudent.languages.includes(language.code)}
                        onCheckedChange={() => toggleStudentSelection('languages', language.code)}
                      />
                      {language.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Технические навыки</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-[#dfe1e6] p-4 max-h-64 overflow-y-auto">
                  {skills.map((skill) => (
                    <label key={skill.code} className="flex items-center gap-3 text-sm text-[#172b4d]">
                      <Checkbox
                        checked={newStudent.skills.includes(skill.code)}
                        onCheckedChange={() => toggleStudentSelection('skills', skill.code)}
                      />
                      {skill.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Soft skills</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-[#dfe1e6] p-4 max-h-64 overflow-y-auto">
                  {softSkills.map((skill) => (
                    <label key={skill.code} className="flex items-center gap-3 text-sm text-[#172b4d]">
                      <Checkbox
                        checked={newStudent.softSkills.includes(skill.code)}
                        onCheckedChange={() => toggleStudentSelection('softSkills', skill.code)}
                      />
                      {skill.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleCreateStudent}
              disabled={!newStudent.fullName.trim() || !newStudent.email.trim() || !newStudent.program || !newStudent.birthDate}
              className="bg-[#0052cc] hover:bg-[#0747a6]"
            >
              Сохранить студента
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Modal */}
      <StudentModal
        student={selectedStudent}
        languages={languages}
        skills={skills}
        softSkills={softSkills}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onDelete={onDeleteStudent}
        onUpdate={onUpdateStudent}
      />
    </div>
  );
}
