import React, { useMemo } from 'react';
import { Skill, Student } from '../types';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Award, BookOpen } from 'lucide-react';
import { StatusBadge } from './common/StatusBadge';

interface DashboardPageProps {
  students: Student[];
  skills: Skill[];
  isLoading: boolean;
  onNavigateToStudent: (studentId: string) => void;
}

export function DashboardPage({ students, skills, isLoading, onNavigateToStudent }: DashboardPageProps) {
  const stats = useMemo(() => {
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const avgGpa = students.reduce((sum, s) => sum + s.gpa, 0) / students.length || 0;
    const totalSkills = new Set(students.flatMap(s => s.skills)).size;
    
    return {
      total: students.length,
      active: activeStudents,
      avgGpa: avgGpa.toFixed(2),
      totalSkills,
    };
  }, [students]);

  const programData = useMemo(() => {
    const programCounts = students.reduce((acc, student) => {
      acc[student.program] = (acc[student.program] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(programCounts).map(([name, value]) => ({
      name: name.length > 30 ? name.substring(0, 30) + '...' : name,
      students: value,
    }));
  }, [students]);

  const statusData = useMemo(() => {
    const statusCounts = students.reduce((acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name === 'Active' ? 'Активные' : name === 'Graduated' ? 'Выпускники' : 'В отпуске',
      value,
    }));
  }, [students]);

  const topSkills = useMemo(() => {
    const skillCounts = students.reduce((acc, student) => {
      student.skills.forEach(skill => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(skillCounts)
      .map(([code, count]) => ({
        code,
        name: skills.find(s => s.code === code)?.name || code,
        count,
        percentage: (count / students.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [students, skills]);

  const recentUpdates = useMemo(() => {
    return [...students]
      .filter(s => s.lastUpdated)
      .sort((a, b) => new Date(b.lastUpdated!).getTime() - new Date(a.lastUpdated!).getTime())
      .slice(0, 5);
  }, [students]);

  const COLORS = ['#0052cc', '#6554c0', '#00875a', '#ff991f', '#ff5630', '#00b8d9'];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="bg-gradient-to-r from-white to-[#fafbfc] p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#dfe1e6] shadow-sm">
        <h1 className="text-[#172b4d] mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl">Dashboard</h1>
        <p className="text-[#5e6c84] text-sm sm:text-base">Обзор данных студентов и статистика</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <Card className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#fafbfc] rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5e6c84] mb-2">Всего студентов</p>
              <h3 className="text-[#172b4d] text-2xl sm:text-3xl">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#deebff] to-[#b3d4ff] rounded-2xl flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#0052cc]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#fafbfc] rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5e6c84] mb-2">Активных</p>
              <h3 className="text-[#172b4d] text-2xl sm:text-3xl">{stats.active}</h3>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#e3fcef] to-[#abf5d1] rounded-2xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-[#006644]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#fafbfc] rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5e6c84] mb-2">Средний GPA</p>
              <h3 className="text-[#172b4d] text-2xl sm:text-3xl">{stats.avgGpa}</h3>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#fff4e6] to-[#ffecb3] rounded-2xl flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff991f]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#fafbfc] rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5e6c84] mb-2">Всего навыков</p>
              <h3 className="text-[#172b4d] text-2xl sm:text-3xl">{stats.totalSkills}</h3>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#e9f2ff] to-[#c7d9f7] rounded-2xl flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-[#6554c0]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Bar Chart - Students by Program */}
        <Card className="p-6 sm:p-8 lg:p-10 border-0 shadow-md rounded-2xl bg-white">
          <h3 className="text-[#172b4d] mb-6 sm:mb-8 text-lg sm:text-xl">Студенты по программам</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={programData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5e6c84' }} />
              <YAxis tick={{ fontSize: 12, fill: '#5e6c84' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #dfe1e6',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Bar dataKey="students" fill="#0052cc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Status Distribution */}
        <Card className="p-6 sm:p-8 lg:p-10 border-0 shadow-md rounded-2xl bg-white">
          <h3 className="text-[#172b4d] mb-6 sm:mb-8 text-lg sm:text-xl">Распределение по статусу</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #dfe1e6',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Top Skills */}
        <Card className="p-6 sm:p-8 lg:p-10 border-0 shadow-md rounded-2xl bg-white">
          <h3 className="text-[#172b4d] mb-6 sm:mb-8 text-lg sm:text-xl">Топ-5 навыков среди студентов</h3>
          <div className="space-y-4 sm:space-y-6">
            {topSkills.map((skill, index) => (
              <div key={skill.code} className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#0052cc] to-[#0747a6] rounded-xl flex items-center justify-center text-white text-xs sm:text-sm shadow-md flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-[#172b4d] text-sm sm:text-base">{skill.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#5e6c84] bg-[#f4f5f7] px-3 sm:px-4 py-1 rounded-full whitespace-nowrap ml-2">{skill.count}</span>
                </div>
                <div className="w-full bg-[#f4f5f7] rounded-full h-2 sm:h-3">
                  <div
                    className="bg-gradient-to-r from-[#0052cc] to-[#0747a6] h-2 sm:h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Updates */}
        <Card className="p-6 sm:p-8 lg:p-10 border-0 shadow-md rounded-2xl bg-white">
          <h3 className="text-[#172b4d] mb-6 sm:mb-8 text-lg sm:text-xl">Недавно обновлённые студенты</h3>
          <div className="space-y-3 sm:space-y-4">
            {recentUpdates.map(student => (
              <div
                key={student.id}
                onClick={() => onNavigateToStudent(student.id)}
                className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-[#f4f5f7] to-[#fafbfc] rounded-2xl hover:from-[#deebff] hover:to-[#e9f2ff] transition-all cursor-pointer border border-transparent hover:border-[#b3d4ff] hover:shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#172b4d] mb-1 sm:mb-2 text-sm sm:text-base truncate">{student.fullName}</p>
                  <p className="text-xs sm:text-sm text-[#5e6c84] truncate">{student.program}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <StatusBadge status={student.status} />
                  <p className="text-xs text-[#5e6c84] mt-1 sm:mt-2">
                    {new Date(student.lastUpdated!).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
