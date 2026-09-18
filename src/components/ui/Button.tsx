import React from 'react';
import { ArrowUpRight, ArrowRight } from '@phosphor-icons/react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'base' | 'outline' | 'ghost';
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: 'arrow' | 'diagonal' | 'none';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'base',
  href,
  onClick,
  className = '',
  icon = 'diagonal',
  type = 'button',
  disabled = false,
}) => {
  const baseStyles =
    'group relative inline-flex items-center justify-between gap-3 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 active:scale-[0.98] select-none cursor-pointer overflow-hidden';

  const variantStyles = {
    base: 'bg-[#192823] text-white hover:bg-[#243831] border border-transparent shadow-sm',
    dark: 'bg-[#101e19] text-[#f6f4ee] hover:bg-[#192823] border border-white/10 shadow-sm',
    light: 'bg-[#f6f4ee] text-[#192823] hover:bg-white border border-[#192823]/10 shadow-sm',
    outline: 'bg-transparent text-[#192823] hover:bg-[#192823]/5 border border-[#192823]/25',
    ghost: 'bg-transparent text-[#192823] hover:bg-black/5 border-transparent',
  };

  const iconWrapperStyles = {
    base: 'w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    dark: 'w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    light: 'w-7 h-7 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    outline: 'w-7 h-7 rounded-full bg-[#192823]/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    ghost: 'w-7 h-7 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5',
  };

  const content = (
    <>
      <span className="tracking-tight whitespace-nowrap">{children}</span>
      {icon !== 'none' && (
        <span className={iconWrapperStyles[variant]}>
          {icon === 'diagonal' ? (
            <ArrowUpRight size={14} weight="bold" />
          ) : (
            <ArrowRight size={14} weight="bold" />
          )}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {content}
    </button>
  );
};
