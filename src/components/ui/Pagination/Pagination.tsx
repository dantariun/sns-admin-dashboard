import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, totalElements, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
      <span>총 {totalElements.toLocaleString()}건</span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-3 py-1 font-medium">
          {page + 1} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
