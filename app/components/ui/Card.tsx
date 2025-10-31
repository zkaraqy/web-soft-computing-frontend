/**
 * Card Component - Reusable card with Tailwind v4
 */

import { ReactNode } from 'react';
import { cn } from '@/app/lib/utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 p-6',
        hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
