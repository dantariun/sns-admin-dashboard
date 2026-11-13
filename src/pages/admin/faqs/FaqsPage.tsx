import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { SearchSection } from '@/components/common/wrapper/SearchSection';
import { TableSection } from '@/components/common/wrapper/TableSection';
import { Badge } from '@/components/ui/Badge/Badge';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Button } from '@/components/ui/Button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { SkeletonTable } from '@/components/ui/Skeleton/Skeleton';
import { ConfirmModal } from '@/components/common/Modal/Modal';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Faq, FaqCategory } from '@/types/notice';
import type { ApiResponse, PageResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const CATEGORY_OPTIONS = [
  { label: '전체 카테고리', value: '' },
  { label: '계정', value: 'ACCOUNT' },
  { label: '피드', value: 'FEED' },
  { label: '신고', value: 'REPORT' },
  { label: '기타', value: 'ETC' },
];
const CATEGORY_LABEL: Record<FaqCategory, string> = {
  ACCOUNT: '계정',
  FEED: '피드',
  REPORT: '신고',
  ETC: '기타',
};
const CATEGORY_VARIANT: Record<FaqCategory, 'info' | 'success' | 'warning' | 'default'> = {
  ACCOUNT: 'info',
  FEED: 'success',
  REPORT: 'warning',
  ETC: 'default',
};

export function FaqsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [category, setCategory] = useState<FaqCategory | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['faqs', page, searchKeyword, category],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PageResponse<Faq>>>('/faqs', { params: { page, size: 20, keyword: searchKeyword, category } })
        .then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/faqs/${id}`),
    onSuccess: () => {
      addToast('success', 'FAQ가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setDeleteTarget(null);
    },
    onError: () => { addToast('error', '삭제 중 오류가 발생했습니다.'); setDeleteTarget(null); },
  });

  return (
    <PageWrapper
      title="FAQ"
      actions={
        <Button size="sm" onClick={() => navigate({ to: `${ROUTES.ADMIN_FAQ}/new` })}>
          <Plus size={14} className="mr-1.5" />
          FAQ 등록
        </Button>
      }
    >
      <SearchSection>
        <div className="flex-1 min-w-48">
          <Input
            placeholder="질문 또는 답변 내용 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setSearchKeyword(keyword); setPage(0); } }}
          />
        </div>
        <div className="w-40">
          <Select
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => { setCategory(e.target.value as FaqCategory | ''); setPage(0); }}
          />
        </div>
        <Button onClick={() => { setSearchKeyword(keyword); setPage(0); }}>
          <Search size={14} className="mr-1.5" />
          검색
        </Button>
      </SearchSection>

      <TableSection>
        {isLoading ? (
          <SkeletonTable rows={8} cols={4} />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">질문</th>
                  <th className="px-4 py-3 text-center font-medium">카테고리</th>
                  <th className="px-4 py-3 text-left font-medium">작성일</th>
                  <th className="px-4 py-3 text-left font-medium">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.content.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`${ROUTES.ADMIN_FAQ}/${f.id}`}
                        className="text-gray-800 hover:text-primary-600"
                      >
                        {f.question}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={CATEGORY_VARIANT[f.category]}>{CATEGORY_LABEL[f.category]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {format(new Date(f.createdAt), 'yyyy.MM.dd')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate({ to: `${ROUTES.ADMIN_FAQ}/${f.id}/edit` })}
                        >
                          수정
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(f)}>
                          <span className="text-red-500">삭제</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.content.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                      FAQ가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={data?.page ?? 0}
              totalPages={data?.totalPages ?? 0}
              totalElements={data?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </TableSection>

      {deleteTarget && (
        <ConfirmModal
          open
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          title="FAQ 삭제"
          message={`"${deleteTarget.question}" 항목을 삭제하시겠습니까?`}
          confirmLabel="삭제"
          confirmVariant="danger"
          loading={deleteMutation.isPending}
        />
      )}
    </PageWrapper>
  );
}
