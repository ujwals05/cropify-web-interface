import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  isLoading,
  loadingText = "Loading...",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform";
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95",
    secondary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95",
    ghost: "bg-transparent text-primary hover:bg-primary/5",
    outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent/10 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-md",
    lg: "px-10 py-5 text-lg",
  };

  return (
    <motion.button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="animate-pulse">{loadingText}</span>
        </div>
      ) : children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
