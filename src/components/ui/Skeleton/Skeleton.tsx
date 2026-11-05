import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
};

export function Skeleton({ className, variant = 'line' }: Props) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'line' && 'h-4 rounded',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-lg',
        className,
      )}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <tbody className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
