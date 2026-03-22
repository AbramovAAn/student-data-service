import React from 'react';
import { Mail, Phone, Send } from 'lucide-react';

interface ContactInfoProps {
  email?: string;
  phone?: string;
  telegram?: string;
}

export function ContactInfo({ email, phone, telegram }: ContactInfoProps) {
  return (
    <div className="space-y-3">
      {email && (
        <div className="flex items-center gap-3 text-[#5e6c84]">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <a href={`mailto:${email}`} className="text-sm hover:text-[#0052cc] transition-colors">
            {email}
          </a>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-3 text-[#5e6c84]">
          <Phone className="w-4 h-4 flex-shrink-0" />
          <a href={`tel:${phone}`} className="text-sm hover:text-[#0052cc] transition-colors">
            {phone}
          </a>
        </div>
      )}
      {telegram && (
        <div className="flex items-center gap-3 text-[#5e6c84]">
          <Send className="w-4 h-4 flex-shrink-0" />
          <a 
            href={`https://t.me/${telegram.replace('@', '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-[#0052cc] transition-colors"
          >
            {telegram}
          </a>
        </div>
      )}
    </div>
  );
}
