import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'accent' | 'primary';
  hoverEffect?: boolean;
}

export default function Card({ 
  children, 
  variant = 'default', 
  hoverEffect = true,
  className, 
  ...props 
}: CardProps) {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300";
  
  const variants = {
    default: "bg-white shadow-lg border border-muted/20",
    glass: "glass-light",
    accent: "accent-gradient text-accent-foreground shadow-lg",
    primary: "tonal-gradient text-white shadow-lg",
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
