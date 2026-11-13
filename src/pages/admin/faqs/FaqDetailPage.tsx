import { useState } from 'react';
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
import type { Faq, FaqCategory } from '@/types/notice';
import type { ApiResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

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

export function FaqDetailPage() {
  const { faqId } = useParams({ from: '/admin/faqs/$faqId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [showDelete, setShowDelete] = useState(false);

  const { data: faq, isLoading } = useQuery({
    queryKey: ['faq', faqId],
    queryFn: () =>
      apiClient.get<ApiResponse<Faq>>(`/faqs/${faqId}`).then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/faqs/${faqId}`),
    onSuccess: () => {
      addToast('success', 'FAQ가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      navigate({ to: ROUTES.ADMIN_FAQ });
    },
    onError: () => { addToast('error', '삭제 중 오류가 발생했습니다.'); setShowDelete(false); },
  });

  return (
    <PageWrapper
      title="FAQ 상세"
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: ROUTES.ADMIN_FAQ })}>
            <ArrowLeft size={14} className="mr-1" />
            목록
          </Button>
          {faq && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate({ to: `${ROUTES.ADMIN_FAQ}/${faqId}/edit` })}
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
      ) : faq ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-2xl">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <Badge variant={CATEGORY_VARIANT[faq.category]}>{CATEGORY_LABEL[faq.category]}</Badge>
            <p className="text-xs text-gray-400">
              {format(new Date(faq.createdAt), 'yyyy년 MM월 dd일')}
            </p>
          </div>
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">Q</p>
            <p className="text-sm font-medium text-gray-900 leading-relaxed">{faq.question}</p>
          </div>
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">A</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">FAQ를 찾을 수 없습니다.</p>
      )}

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="FAQ 삭제"
        message="이 FAQ를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </PageWrapper>
  );
}
