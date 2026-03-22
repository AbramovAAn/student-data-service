import React from 'react';
import { User } from 'lucide-react';

interface StudentAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function StudentAvatar({ name, size = 'md' }: StudentAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return fullName[0] || '?';
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-[#0052cc]',
      'bg-[#6554c0]',
      'bg-[#00875a]',
      'bg-[#ff5630]',
      'bg-[#ff991f]',
      'bg-[#00b8d9]',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(
        name
      )} rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
}
