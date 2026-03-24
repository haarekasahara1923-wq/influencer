import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function StatusChip({ status, variant }: { status: string; variant?: 'primary' | 'success' | 'warning' | 'neutral' }) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-100 text-green-600 border-green-200',
    warning: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    neutral: 'bg-zinc-100 text-zinc-500 border-border',
  };

  return (
    <span className={cn(
      'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm',
      variants[variant || 'neutral']
    )}>
      {status}
    </span>
  );
}
