import React from 'react';
import { Badge } from '../ui/badge';

interface SkillChipProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
}

export function SkillChip({ label, variant = 'outline' }: SkillChipProps) {
  const variantStyles = {
    primary: 'bg-[#deebff] text-[#0052cc] border-0 hover:bg-[#b3d4ff]',
    secondary: 'bg-[#f4f5f7] text-[#5e6c84] border-0 hover:bg-[#dfe1e6]',
    success: 'bg-[#e3fcef] text-[#006644] border-0 hover:bg-[#abf5d1]',
    outline: 'border-[#0052cc] text-[#0052cc] bg-white hover:bg-[#deebff]',
  };

  return (
    <Badge className={`${variantStyles[variant]} transition-colors duration-200 px-4 py-1.5 text-xs rounded-xl shadow-sm`}>
      {label}
    </Badge>
  );
}