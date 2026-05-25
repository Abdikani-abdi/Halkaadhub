import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  className?: string;
  text?: string;
}

export default function Spinner({ className = '', text }: SpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      {text && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
}
