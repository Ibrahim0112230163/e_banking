import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
<<<<<<< HEAD
  const baseStyles = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#0D7C66] text-white hover:bg-[#0B6B57] focus:ring-[#0D7C66] disabled:bg-muted disabled:text-muted-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    outline: 'border-2 border-[#0D7C66] text-[#0D7C66] hover:bg-[#0D7C66] hover:text-white focus:ring-[#0D7C66]',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
=======
  const baseStyles = 'rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-white border-2 border-primary text-primary hover:bg-slate-50',
    accent: 'bg-accent text-white hover:opacity-90 shadow-md hover:shadow-lg',
    outline: 'border border-border text-foreground hover:bg-slate-50',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
    danger: 'bg-destructive text-white hover:opacity-90',
>>>>>>> origin/updated
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} disabled:cursor-not-allowed`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
