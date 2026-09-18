import React from 'react';

export interface DoubleBezelCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'cream';
  className?: string;
  innerClassName?: string;
  onClick?: () => void;
}

export const DoubleBezelCard: React.FC<DoubleBezelCardProps> = ({
  children,
  variant = 'light',
  className = '',
  innerClassName = '',
  onClick,
}) => {
  const outerStyles = {
    light: 'bg-black/[0.03] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)]',
    dark: 'bg-white/[0.05] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]',
    cream: 'bg-[#192823]/[0.04] border border-[#192823]/[0.08]',
  };

  const innerStyles = {
    light: 'bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] text-[#192823]',
    dark: 'bg-[#101e19] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] text-[#f6f4ee]',
    cream: 'bg-[#edebe3] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] text-[#192823]',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-[2rem] p-1.5 transition-all duration-300 ${outerStyles[variant]} ${className}`}
    >
      <div
        className={`rounded-[calc(2rem-0.375rem)] p-6 md:p-8 h-full transition-all duration-300 ${innerStyles[variant]} ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
