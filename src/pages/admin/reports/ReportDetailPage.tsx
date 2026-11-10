import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { TitleWrapper } from '@/components/common/wrapper/TitleWrapper';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Select } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ConfirmModal } from '@/components/common/Modal/Modal';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Report, ReportStatus, ReportTargetType, ReportAction } from '@/types/report';
import type { ApiResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const STATUS_VARIANT: Record<ReportStatus, 'warning' | 'success' | 'muted'> = {
  PENDING: 'warning',
  PROCESSED: 'success',
  DISMISSED: 'muted',
};
const STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: '미처리',
  PROCESSED: '처리완료',
  DISMISSED: '기각',
};
const TARGET_LABEL: Record<ReportTargetType, string> = {
  FEED: '피드',
  COMMENT: '댓글',
  MEMBER: '회원',
};
const ACTION_OPTIONS = [
  { label: '처리 유형 선택', value: '' },
  { label: '경고', value: 'WARNING' },
  { label: '블라인드', value: 'BLIND' },
  { label: '계정 정지', value: 'SUSPEND' },
  { label: '기각 (무효)', value: 'DISMISS' },
];
const ACTION_LABEL: Record<ReportAction, string> = {
  WARNING: '경고',
  BLIND: '블라인드',
  SUSPEND: '계정 정지',
  DISMISS: '기각',
};

const schema = z.object({
  action: z.string().min(1, '처리 유형을 선택해주세요.'),
  memo: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex py-3 border-b border-gray-100 last:border-0">
      <dt className="w-28 text-sm text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800">{value}</dd>
    </div>
  );
}

export function ReportDetailPage() {
  const { reportId } = useParams({ from: '/admin/reports/$reportId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () =>
      apiClient.get<ApiResponse<Report>>(`/reports/${reportId}`).then((r) => r.data.data),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const processMutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiClient.post<ApiResponse<null>>(`/reports/${reportId}/process`, values),
    onSuccess: () => {
      addToast('success', '신고가 처리되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowConfirm(false);
    },
    onError: () => {
      addToast('error', '처리 중 오류가 발생했습니다.');
      setShowConfirm(false);
    },
  });

  const dismissMutation = useMutation({
    mutationFn: () =>
      apiClient.post<ApiResponse<null>>(`/reports/${reportId}/dismiss`),
    onSuccess: () => {
      addToast('success', '신고가 기각 처리되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: () => {
      addToast('error', '처리 중 오류가 발생했습니다.');
    },
  });

  function onSubmit(values: FormValues) {
    if (values.action === 'DISMISS') {
      dismissMutation.mutate();
    } else {
      setPendingValues(values);
      setShowConfirm(true);
    }
  }

  return (
    <PageWrapper
      title="신고 상세"
      actions={
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: ROUTES.ADMIN_REPORTS })}>
          <ArrowLeft size={14} className="mr-1" />
          목록으로
        </Button>
      }
    >
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="line" />)}
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Report info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <TitleWrapper title="신고 정보" />
              <dl>
                <InfoRow label="신고 ID" value={`#${report.id}`} />
                <InfoRow label="대상 유형" value={<Badge variant="info">{TARGET_LABEL[report.targetType]}</Badge>} />
                <InfoRow label="대상 ID" value={`#${report.targetId}`} />
                <InfoRow label="신고자" value={report.reporter.nickname} />
                <InfoRow label="신고 사유" value={report.reason} />
                <InfoRow label="신고일" value={format(new Date(report.createdAt), 'yyyy.MM.dd HH:mm')} />
                <InfoRow
                  label="처리 상태"
                  value={<Badge variant={STATUS_VARIANT[report.status]}>{STATUS_LABEL[report.status]}</Badge>}
                />
              </dl>
            </div>

            {/* Processed result */}
            {report.status === 'PROCESSED' && report.processedAction && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <TitleWrapper title="처리 결과" />
                <dl>
                  <InfoRow label="처리 유형" value={<Badge variant="success">{ACTION_LABEL[report.processedAction]}</Badge>} />
                  {report.processedMemo && <InfoRow label="처리 메모" value={report.processedMemo} />}
                  {report.processedAt && (
                    <InfoRow label="처리일" value={format(new Date(report.processedAt), 'yyyy.MM.dd HH:mm')} />
                  )}
                </dl>
              </div>
            )}
          </div>

          {/* Process form */}
          {report.status === 'PENDING' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <TitleWrapper title="신고 처리" />
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">처리 유형 <span className="text-red-500">*</span></label>
                  <Select
                    options={ACTION_OPTIONS}
                    error={errors.action?.message}
                    {...register('action')}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">처리 메모 (선택)</label>
                  <Textarea
                    rows={4}
                    placeholder="처리 사유 또는 메모를 입력하세요."
                    {...register('memo')}
                  />
                </div>
                <Button type="submit" loading={processMutation.isPending || dismissMutation.isPending}>
                  처리 완료
                </Button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">신고를 찾을 수 없습니다.</p>
      )}

      {showConfirm && pendingValues && (
        <ConfirmModal
          open
          onClose={() => setShowConfirm(false)}
          onConfirm={() => processMutation.mutate(pendingValues)}
          title="신고 처리 확인"
          message={`선택한 처리 유형(${ACTION_LABEL[pendingValues.action as ReportAction]})으로 처리하시겠습니까?`}
          confirmLabel="처리"
          loading={processMutation.isPending}
        />
      )}
    </PageWrapper>
  );
}
