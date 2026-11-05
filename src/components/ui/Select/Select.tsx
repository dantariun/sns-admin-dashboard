import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Option = { label: string; value: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ options, error, className, ...props }, ref) => (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          'w-full h-9 px-3 border border-gray-300 rounded-md text-sm bg-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
          error && 'border-red-400',
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  ),
);
Select.displayName = 'Select';
