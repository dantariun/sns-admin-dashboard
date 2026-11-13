import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ConfirmModal } from '@/components/common/Modal/Modal';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Notice } from '@/types/notice';
import type { ApiResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { useState } from 'react';

export function NoticeDetailPage() {
  const { noticeId } = useParams({ from: '/admin/notices/$noticeId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [showDelete, setShowDelete] = useState(false);

  const { data: notice, isLoading } = useQuery({
    queryKey: ['notice', noticeId],
    queryFn: () =>
      apiClient.get<ApiResponse<Notice>>(`/notices/${noticeId}`).then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/notices/${noticeId}`),
    onSuccess: () => {
      addToast('success', '공지사항이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      navigate({ to: ROUTES.ADMIN_NOTICES });
    },
    onError: () => { addToast('error', '삭제 중 오류가 발생했습니다.'); setShowDelete(false); },
  });

  return (
    <PageWrapper
      title="공지사항 상세"
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: ROUTES.ADMIN_NOTICES })}>
            <ArrowLeft size={14} className="mr-1" />
            목록
          </Button>
          {notice && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate({ to: `${ROUTES.ADMIN_NOTICES}/${noticeId}/edit` })}
              >
                <Pencil size={13} className="mr-1" />
                수정
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
                삭제
              </Button>
            </>
          )}
        </div>
      }
    >
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="line" />)}
        </div>
      ) : notice ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 leading-snug">{notice.title}</h2>
              <p className="text-xs text-gray-400 mt-1.5">
                작성일 {format(new Date(notice.createdAt), 'yyyy년 MM월 dd일')}
                {notice.updatedAt !== notice.createdAt && (
                  <span className="ml-2">
                    · 수정일 {format(new Date(notice.updatedAt), 'yyyy.MM.dd')}
                  </span>
                )}
              </p>
            </div>
            <Badge variant={notice.isPublished ? 'success' : 'muted'} className="shrink-0 mt-0.5">
              {notice.isPublished ? '게시중' : '미게시'}
            </Badge>
          </div>
          <div className="px-6 py-6">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">공지사항을 찾을 수 없습니다.</p>
      )}

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="공지사항 삭제"
        message="이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </PageWrapper>
  );
}
