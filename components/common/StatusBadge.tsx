import React from 'react';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Active' | 'Graduated' | 'On leave';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    Active: {
      icon: CheckCircle,
      label: 'Активен',
      className: 'bg-[#e3fcef] text-[#006644] border-0',
    },
    Graduated: {
      icon: CheckCircle,
      label: 'Выпускник',
      className: 'bg-[#deebff] text-[#0052cc] border-0',
    },
    'On leave': {
      icon: Clock,
      label: 'В отпуске',
      className: 'bg-[#fff4e6] text-[#ff991f] border-0',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} hover:${config.className} px-3 py-1`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
