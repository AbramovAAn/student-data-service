import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { GraduationCap } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onError: (message: string) => void;
}

export function LoginPage({ onLogin, onError }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      onError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        onError('Неверный логин или пароль');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0052cc] to-[#0747a6] p-4">
      <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0052cc] rounded-lg flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#172b4d] text-center">Student Data Service</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
              className="h-10"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="h-10"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-[#0052cc] hover:bg-[#0747a6]"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>

          <p className="text-sm text-[#5e6c84] text-center">
            Для входа используйте учетные данные администратора HSE
          </p>
        </form>
      </Card>
    </div>
  );
}
