import React, { useState } from 'react';
import { Language, Skill, Student } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Trash2, Edit, Save, X, Award, Calendar, Briefcase, Target, ExternalLink, TrendingUp } from 'lucide-react';
import { StudentAvatar } from './common/StudentAvatar';
import { ContactInfo } from './common/ContactInfo';
import { SkillChip } from './common/SkillChip';
import { StatusBadge } from './common/StatusBadge';

interface StudentModalProps {
  student: Student | null;
  languages: Language[];
  skills: Skill[];
  softSkills: Skill[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (student: Student) => void;
}

export function StudentModal({ student, languages, skills, softSkills, isOpen, onClose, onDelete, onUpdate }: StudentModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState('');

  if (!student) return null;

  const handleEdit = () => {
    setEditedNote(student.note || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate({ ...student, note: editedNote });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNote('');
  };

  const getLanguageName = (code: string) => {
    return languages.find(l => l.code === code)?.name || code;
  };

  const getSkillName = (code: string) => {
    return skills.find(s => s.code === code)?.name || code;
  };

  const getSoftSkillName = (code: string) => {
    return softSkills.find(s => s.code === code)?.name || code;
  };

  const getStudentLevel = (gpa: number) => {
    if (gpa >= 4.7) return { label: 'Отличный кандидат', color: 'text-[#006644]', bg: 'bg-[#e3fcef]' };
    if (gpa >= 4.3) return { label: 'Сильный кандидат', color: 'text-[#0052cc]', bg: 'bg-[#deebff]' };
    if (gpa >= 3.8) return { label: 'Хороший уровень', color: 'text-[#ff991f]', bg: 'bg-[#fff4e6]' };
    return { label: 'Базовый уровень', color: 'text-[#5e6c84]', bg: 'bg-[#f4f5f7]' };
  };

  const level = getStudentLevel(student.gpa);

  const generateSummary = () => {
    const topSkills = student.skills.slice(0, 3).map(getSkillName).join(', ');
    return `Студент ${student.course} курса с навыками ${topSkills}, GPA ${student.gpa.toFixed(1)} и интересом к ${student.internshipPreferences}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="pb-6 sm:pb-8 border-b border-[#dfe1e6]">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl">Карточка студента</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 sm:space-y-8 lg:space-y-10 py-4 sm:py-6 lg:py-8">
          {/* Summary Section */}
          <div className="bg-gradient-to-br from-[#deebff] via-[#e9f2ff] to-[#deebff] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#b3d4ff]">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <StudentAvatar name={student.fullName} size="lg" />
              
              <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                <div>
                  <h2 className="text-[#172b4d] mb-2 text-lg sm:text-xl lg:text-2xl">{student.fullName}</h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <StatusBadge status={student.status} />
                    <span className={`px-3 py-1 ${level.bg} ${level.color} rounded-lg text-xs sm:text-sm`}>
                      {level.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-start gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#0052cc]" />
                    <div>
                      <p className="text-xs text-[#5e6c84]">GPA</p>
                      <p className="text-[#172b4d] text-sm sm:text-base">{student.gpa.toFixed(1)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#0052cc]" />
                    <div>
                      <p className="text-xs text-[#5e6c84]">Курс</p>
                      <p className="text-[#172b4d] text-sm sm:text-base">{student.course}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#0052cc]" />
                    <div>
                      <p className="text-xs text-[#5e6c84]">Год поступления</p>
                      <p className="text-[#172b4d] text-sm sm:text-base">{student.yearEnrolled}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5e6c84] italic leading-relaxed">{generateSummary()}</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Left Column - Basic Info & Contact */}
            <div className="space-y-8">
              <div>
                <Label className="text-[#5e6c84] mb-4 block">Основная информация</Label>
                <div className="space-y-4 bg-gradient-to-br from-[#f4f5f7] to-[#fafbfc] p-8 rounded-2xl border border-[#dfe1e6]">
                  <div>
                    <p className="text-xs text-[#5e6c84] mb-1">Программа обучения</p>
                    <p className="text-sm text-[#172b4d]">{student.program}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5e6c84] mb-1">Дата рождения</p>
                    <p className="text-sm text-[#172b4d]">
                      {new Date(student.birthDate).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[#5e6c84] mb-4 block">Контакты</Label>
                <div className="bg-gradient-to-br from-[#f4f5f7] to-[#fafbfc] p-8 rounded-2xl border border-[#dfe1e6]">
                  <ContactInfo 
                    email={student.email}
                    phone={student.phone}
                    telegram={student.telegram}
                  />
                </div>
              </div>

              {student.portfolioUrl && (
                <div>
                  <Label className="text-[#5e6c84] mb-4 block">Портфолио</Label>
                  <a
                    href={student.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gradient-to-r from-[#deebff] to-[#b3d4ff] text-[#0052cc] p-5 rounded-2xl hover:from-[#b3d4ff] hover:to-[#deebff] transition-all shadow-md hover:shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span className="font-medium">Открыть портфолио</span>
                  </a>
                </div>
              )}
            </div>

            {/* Middle Column - Skills & Experience */}
            <div className="space-y-8">
              <div>
                <Label className="text-[#5e6c84] mb-4 block">Языки</Label>
                <div className="flex flex-wrap gap-2">
                  {student.languages.map((lang) => (
                    <SkillChip key={lang} label={getLanguageName(lang)} variant="primary" />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-[#5e6c84] mb-4 block">Технические навыки</Label>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <SkillChip key={skill} label={getSkillName(skill)} variant="outline" />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-[#5e6c84] mb-4 block">Soft Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {student.softSkills.map((skill) => (
                    <SkillChip key={skill} label={getSoftSkillName(skill)} variant="success" />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-[#5e6c84] mb-4 block flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Практический опыт
                </Label>
                <div className="bg-gradient-to-br from-[#f4f5f7] to-[#fafbfc] p-8 rounded-2xl border border-[#dfe1e6]">
                  <p className="text-sm text-[#172b4d] leading-relaxed">{student.practicalExperience}</p>
                </div>
              </div>

              <div>
                <Label className="text-[#5e6c84] mb-4 block flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Пожелания по стажировке
                </Label>
                <div className="bg-gradient-to-r from-[#fff4e6] to-[#ffecb3] p-6 rounded-2xl border-l-4 border-[#ff991f] shadow-sm">
                  <p className="text-sm text-[#172b4d]">{student.internshipPreferences}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Notes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-[#5e6c84]">Заметки</Label>
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 px-3 rounded-xl hover:bg-[#deebff]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    placeholder="Добавьте заметки о студенте..."
                    className="min-h-[400px] resize-none rounded-2xl"
                  />
                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      className="bg-gradient-to-r from-[#0052cc] to-[#0747a6] hover:from-[#0747a6] hover:to-[#0052cc] flex-1 rounded-xl"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleCancel}
                      className="rounded-xl"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[400px] p-8 bg-gradient-to-br from-[#f4f5f7] to-[#fafbfc] rounded-2xl border border-[#dfe1e6]">
                  <p className="text-sm text-[#5e6c84] leading-relaxed whitespace-pre-wrap">
                    {student.note || 'Заметки отсутствуют'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 sm:pt-8 border-t border-[#dfe1e6]">
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Вы уверены, что хотите удалить этого студента?')) {
                onDelete(student.id);
                onClose();
              }
            }}
            className="bg-[#de350b] hover:bg-[#bf2600] rounded-xl px-4 sm:px-6 w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить
          </Button>
          
          <Button variant="outline" onClick={onClose} className="rounded-xl px-4 sm:px-6 w-full sm:w-auto">
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
