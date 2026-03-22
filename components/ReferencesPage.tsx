import React, { useState } from 'react';
import { Program, Language, Skill } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface ReferencesPageProps {
  programs: Program[];
  languages: Language[];
  skills: Skill[];
  onAddProgram: (program: Omit<Program, 'id'>) => void;
  onAddLanguage: (language: Omit<Language, 'id'>) => void;
  onAddSkill: (skill: Omit<Skill, 'id'>) => void;
  onDeleteProgram: (id: string) => void;
  onDeleteLanguage: (id: string) => void;
  onDeleteSkill: (id: string) => void;
}

type ReferenceType = 'program' | 'language' | 'skill';

export function ReferencesPage({
  programs,
  languages,
  skills,
  onAddProgram,
  onAddLanguage,
  onAddSkill,
  onDeleteProgram,
  onDeleteLanguage,
  onDeleteSkill,
}: ReferencesPageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<ReferenceType>('program');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!code || !name) return;

    const newItem = { code, name };

    switch (activeType) {
      case 'program':
        onAddProgram(newItem);
        break;
      case 'language':
        onAddLanguage(newItem);
        break;
      case 'skill':
        onAddSkill(newItem);
        break;
    }

    setCode('');
    setName('');
    setIsAddDialogOpen(false);
  };

  const openAddDialog = (type: ReferenceType) => {
    setActiveType(type);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[#172b4d] mb-2">Справочники</h1>
        <p className="text-[#5e6c84]">Управление программами, языками и навыками</p>
      </div>

      <Card className="p-8">
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="programs">Программы обучения</TabsTrigger>
            <TabsTrigger value="languages">Языки</TabsTrigger>
            <TabsTrigger value="skills">Навыки</TabsTrigger>
          </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => openAddDialog('program')}
                className="bg-[#0052cc] hover:bg-[#0747a6]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить программу
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Код</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>{program.code}</TableCell>
                    <TableCell>{program.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProgram(program.id)}
                        className="text-[#de350b] hover:text-[#bf2600] hover:bg-[#ffebe6]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => openAddDialog('language')}
                className="bg-[#0052cc] hover:bg-[#0747a6]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить язык
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Код</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.map((language) => (
                  <TableRow key={language.id}>
                    <TableCell>{language.code}</TableCell>
                    <TableCell>{language.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteLanguage(language.id)}
                        className="text-[#de350b] hover:text-[#bf2600] hover:bg-[#ffebe6]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => openAddDialog('skill')}
                className="bg-[#0052cc] hover:bg-[#0747a6]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить навык
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Код</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell>{skill.code}</TableCell>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSkill(skill.id)}
                        className="text-[#de350b] hover:text-[#bf2600] hover:bg-[#ffebe6]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Добавить {
                activeType === 'program' ? 'программу' :
                activeType === 'language' ? 'язык' : 'навык'
              }
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Например: PMI, en, python"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Полное название"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!code || !name}
              className="bg-[#0052cc] hover:bg-[#0747a6]"
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}