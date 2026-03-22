import React, { useState } from 'react';
import { Consent, Student } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { CheckCircle, XCircle, Edit, Plus } from 'lucide-react';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface ConsentsPageProps {
  consents: Consent[];
  students: Student[];
  onAddConsent: (consent: Omit<Consent, 'id'>) => void;
  onUpdateConsent: (consent: Consent) => void;
}

export function ConsentsPage({ consents, students, onAddConsent, onUpdateConsent }: ConsentsPageProps) {
  const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'Active' | 'Revoked'>('Active');
  const [newConsent, setNewConsent] = useState<Omit<Consent, 'id'>>({
    studentName: '',
    type: 'Обработка персональных данных',
    date: new Date().toISOString().slice(0, 10),
    status: 'Active',
  });

  const handleEdit = (consent: Consent) => {
    setSelectedConsent(consent);
    setNewStatus(consent.status);
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedConsent) {
      onUpdateConsent({ ...selectedConsent, status: newStatus });
      setIsEditDialogOpen(false);
      setSelectedConsent(null);
    }
  };

  const handleOpenAddDialog = () => {
    setNewConsent({
      studentName: students[0]?.fullName || '',
      type: 'Обработка персональных данных',
      date: new Date().toISOString().slice(0, 10),
      status: 'Active',
    });
    setIsAddDialogOpen(true);
  };

  const handleCreateConsent = () => {
    if (!newConsent.studentName || !newConsent.type.trim() || !newConsent.date) {
      return;
    }

    onAddConsent({
      ...newConsent,
      type: newConsent.type.trim(),
    });
    setIsAddDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#172b4d] mb-2">Согласия на обработку данных</h1>
          <p className="text-[#5e6c84]">Управление согласиями студентов</p>
        </div>
        <Button
          onClick={handleOpenAddDialog}
          className="bg-[#0052cc] hover:bg-[#0747a6] shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить согласие
        </Button>
      </div>

      <Card className="p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО студента</TableHead>
              <TableHead>Тип согласия</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consents.map((consent) => (
              <TableRow key={consent.id}>
                <TableCell>{consent.studentName}</TableCell>
                <TableCell>{consent.type}</TableCell>
                <TableCell>{formatDate(consent.date)}</TableCell>
                <TableCell>
                  {consent.status === 'Active' ? (
                    <Badge className="bg-[#e3fcef] text-[#006644] hover:bg-[#e3fcef] border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Активно
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-[#ffebe6] text-[#de350b] hover:bg-[#ffebe6] border-0">
                      <XCircle className="w-3 h-3 mr-1" />
                      Отозвано
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(consent)}
                    className="text-[#0052cc] hover:text-[#0747a6] hover:bg-[#deebff]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить согласие</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Студент</Label>
              <Select
                value={newConsent.studentName}
                onValueChange={(value) => setNewConsent((prev) => ({ ...prev, studentName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите студента" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.fullName}>
                      {student.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consentType">Тип согласия</Label>
              <Input
                id="consentType"
                value={newConsent.type}
                onChange={(e) => setNewConsent((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="Например: Публикация достижений"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consentDate">Дата</Label>
                <Input
                  id="consentDate"
                  type="date"
                  value={newConsent.date}
                  onChange={(e) => setNewConsent((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Статус</Label>
                <Select
                  value={newConsent.status}
                  onValueChange={(value: 'Active' | 'Revoked') => setNewConsent((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Активно</SelectItem>
                    <SelectItem value="Revoked">Отозвано</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleCreateConsent}
              disabled={!newConsent.studentName || !newConsent.type.trim() || !newConsent.date}
              className="bg-[#0052cc] hover:bg-[#0747a6]"
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус согласия</DialogTitle>
          </DialogHeader>

          {selectedConsent && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-[#5e6c84] mb-1">Студент</p>
                <p className="text-[#172b4d]">{selectedConsent.studentName}</p>
              </div>

              <div>
                <p className="text-sm text-[#5e6c84] mb-1">Тип согласия</p>
                <p className="text-[#172b4d]">{selectedConsent.type}</p>
              </div>

              <div>
                <p className="text-sm text-[#5e6c84] mb-1">Дата</p>
                <p className="text-[#172b4d]">{formatDate(selectedConsent.date)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select value={newStatus} onValueChange={(value: 'Active' | 'Revoked') => setNewStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Активно</SelectItem>
                    <SelectItem value="Revoked">Отозвано</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#0052cc] hover:bg-[#0747a6]"
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
