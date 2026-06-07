import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  showK2Label?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, isPassword, showK2Label, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
<<<<<<< HEAD
          <label className="block mb-2 text-foreground">
            {label} {showK2Label && <span className="text-[#0D7C66]">(K2)</span>}
=======
          <label className="block mb-2 text-sm font-semibold text-foreground/80 tracking-wide uppercase">
            {label} {showK2Label && <span className="text-accent">(K2)</span>}
>>>>>>> origin/updated
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
<<<<<<< HEAD
            className={`w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-[#0D7C66] transition-all ${error ? 'border-destructive' : ''} ${className}`}
=======
            className={`w-full px-4 py-3.5 bg-white rounded-xl border border-border focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all duration-200 placeholder:text-muted-foreground/50 ${error ? 'border-destructive focus:ring-destructive/10' : ''} ${className}`}
>>>>>>> origin/updated
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
