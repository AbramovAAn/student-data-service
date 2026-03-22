import React from 'react';
import { GraduationCap, Users, BookOpen, Settings, LogOut, LayoutDashboard, GitCompare, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { MobileMenu } from './MobileMenu';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Layout({ children, currentPage, onNavigate, onLogout }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Студенты', icon: Users },
    { id: 'compare', label: 'Сравнение', icon: GitCompare },
    { id: 'references', label: 'Справочники', icon: BookOpen },
    { id: 'consents', label: 'Согласия', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f5f7] via-[#fafbfc] to-[#f4f5f7]">
      {/* Header */}
      <header className="bg-white border-b border-[#dfe1e6] h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 lg:px-12 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden rounded-xl p-2"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#0052cc] to-[#0747a6] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-[#172b4d] text-sm sm:text-base">Student Data Service</h2>
            <p className="text-xs text-[#5e6c84] hidden md:block">Университетская система</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="text-[#5e6c84] hover:text-[#172b4d] hover:bg-[#f4f5f7] transition-all rounded-xl px-3 sm:px-6"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
          <span className="hidden sm:inline">Выйти</span>
        </Button>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 bg-white border-r border-[#dfe1e6] min-h-[calc(100vh-5rem)] p-8">
          <nav className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0052cc] to-[#0747a6] text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]'
                      : 'text-[#5e6c84] hover:bg-[#f4f5f7] hover:text-[#172b4d] hover:pl-7'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-12">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}