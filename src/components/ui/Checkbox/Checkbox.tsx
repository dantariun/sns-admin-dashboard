import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, className, id, ...props }, ref) => (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn('size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500', className)}
        {...props}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  ),
);
Checkbox.displayName = 'Checkbox';
