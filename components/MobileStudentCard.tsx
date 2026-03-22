import React from 'react';
import { Skill, Student } from '../types';
import { Card } from './ui/card';
import { StudentAvatar } from './common/StudentAvatar';
import { StatusBadge } from './common/StatusBadge';
import { SkillChip } from './common/SkillChip';
import { ChevronRight } from 'lucide-react';

interface MobileStudentCardProps {
  student: Student;
  skills: Skill[];
  onClick: () => void;
}

export function MobileStudentCard({ student, skills, onClick }: MobileStudentCardProps) {
  const getSkillName = (code: string) => {
    return skills.find(s => s.code === code)?.name || code;
  };

  return (
    <Card
      onClick={onClick}
      className="p-5 border-0 shadow-md rounded-2xl bg-white hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-start gap-4 mb-4">
        <StudentAvatar name={student.fullName} size="md" />
        <div className="flex-1 min-w-0">
          <h4 className="text-[#172b4d] mb-2 truncate">{student.fullName}</h4>
          <StatusBadge status={student.status} />
        </div>
        <ChevronRight className="w-5 h-5 text-[#5e6c84] flex-shrink-0" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#5e6c84]">Программа:</span>
          <span className="text-[#172b4d] text-right flex-1 ml-2 truncate">{student.program}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#5e6c84]">Курс:</span>
          <span className="text-[#172b4d]">{student.course}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#5e6c84]">GPA:</span>
          <span className={`px-3 py-1 rounded-lg text-sm ${
            student.gpa >= 4.5 ? 'bg-[#e3fcef] text-[#006644]' :
            student.gpa >= 4.0 ? 'bg-[#deebff] text-[#0052cc]' :
            'bg-[#f4f5f7] text-[#5e6c84]'
          }`}>
            {student.gpa.toFixed(1)}
          </span>
        </div>

        <div>
          <span className="text-[#5e6c84] text-sm mb-2 block">Навыки:</span>
          <div className="flex flex-wrap gap-1.5">
            {student.skills.slice(0, 4).map((skill) => (
              <SkillChip key={skill} label={getSkillName(skill)} variant="outline" />
            ))}
            {student.skills.length > 4 && (
              <SkillChip label={`+${student.skills.length - 4}`} variant="secondary" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
