import React from 'react';
import { LayoutDashboard, Users, GitCompare, BookOpen, Settings, X } from 'lucide-react';
import { Button } from './ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
  onClose: () => void;
}

export function MobileMenu({ isOpen, currentPage, onNavigate, onClose }: MobileMenuProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Студенты', icon: Users },
    { id: 'compare', label: 'Сравнение', icon: GitCompare },
    { id: 'references', label: 'Справочники', icon: BookOpen },
    { id: 'consents', label: 'Согласия', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[#172b4d]">Меню</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0052cc] to-[#0747a6] text-white shadow-lg shadow-blue-500/30'
                      : 'text-[#5e6c84] hover:bg-[#f4f5f7] hover:text-[#172b4d]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
