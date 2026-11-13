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
import { Button } from '@/components/ui/Button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { SkeletonTable } from '@/components/ui/Skeleton/Skeleton';
import { ConfirmModal } from '@/components/common/Modal/Modal';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Notice } from '@/types/notice';
import type { ApiResponse, PageResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

export function NoticesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['notices', page, searchKeyword],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PageResponse<Notice>>>('/notices', { params: { page, size: 20, keyword: searchKeyword } })
        .then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/notices/${id}`),
    onSuccess: () => {
      addToast('success', '공지사항이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setDeleteTarget(null);
    },
    onError: () => { addToast('error', '삭제 중 오류가 발생했습니다.'); setDeleteTarget(null); },
  });

  return (
    <PageWrapper
      title="공지사항"
      actions={
        <Button size="sm" onClick={() => navigate({ to: `${ROUTES.ADMIN_NOTICES}/new` })}>
          <Plus size={14} className="mr-1.5" />
          공지 등록
        </Button>
      }
    >
      <SearchSection>
        <div className="flex-1 min-w-48">
          <Input
            placeholder="제목 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setSearchKeyword(keyword); setPage(0); } }}
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
                  <th className="px-4 py-3 text-left font-medium">제목</th>
                  <th className="px-4 py-3 text-center font-medium">게시 상태</th>
                  <th className="px-4 py-3 text-left font-medium">작성일</th>
                  <th className="px-4 py-3 text-left font-medium">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.content.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`${ROUTES.ADMIN_NOTICES}/${n.id}`}
                        className="text-gray-800 hover:text-primary-600 font-medium"
                      >
                        {n.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={n.isPublished ? 'success' : 'muted'}>
                        {n.isPublished ? '게시중' : '미게시'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {format(new Date(n.createdAt), 'yyyy.MM.dd')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate({ to: `${ROUTES.ADMIN_NOTICES}/${n.id}/edit` })}
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(n)}
                        >
                          <span className="text-red-500">삭제</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.content.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                      공지사항이 없습니다.
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
          title="공지사항 삭제"
          message={`"${deleteTarget.title}" 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
          confirmLabel="삭제"
          confirmVariant="danger"
          loading={deleteMutation.isPending}
        />
      )}
    </PageWrapper>
  );
}
