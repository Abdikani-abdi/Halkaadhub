import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className = '', padding = 'none' }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 ${className}`}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-base font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-2xl ${className}`}>
      {children}
    </div>
  );
}
