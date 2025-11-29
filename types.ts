import React from 'react';

export interface ParentProps {
  role: 'Groom' | 'Bride';
  father: string;
  mother: string;
}

export interface SectionProps {
  className?: string;
  children: React.ReactNode;
}