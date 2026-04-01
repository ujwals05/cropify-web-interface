import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  label, 
  icon: Icon, 
  error, 
  id,
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-primary/80 px-1 block mb-1">
          {label}
        </label>
      )}
      <div className="relative group transition-all duration-300">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-accent transition-colors duration-300">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-white/50 backdrop-blur-sm border border-muted/50 rounded-2xl py-3.5 focus:bg-white focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 font-medium placeholder:text-muted-foreground/30 shadow-sm hover:shadow-md",
            Icon ? "pl-11 pr-4" : "px-4",
            error ? "border-red-500 focus:ring-red-500" : "border-muted/50",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 px-1">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
