import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { TitleWrapper } from '@/components/common/wrapper/TitleWrapper';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ConfirmModal } from '@/components/common/Modal/Modal';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Member, MemberStatus } from '@/types/member';
import type { ApiResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const STATUS_VARIANT: Record<MemberStatus, 'success' | 'warning' | 'danger'> = {
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  WITHDRAWN: 'danger',
};
const STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  WITHDRAWN: '탈퇴',
};

type Action = 'suspend' | 'withdraw' | null;

const ACTION_CONFIG: Record<NonNullable<Action>, { title: string; message: string; label: string; variant: 'primary' | 'danger' }> = {
  suspend: {
    title: '계정 정지',
    message: '이 회원의 계정을 정지하시겠습니까? 정지된 계정은 로그인이 제한됩니다.',
    label: '정지',
    variant: 'danger',
  },
  withdraw: {
    title: '강제 탈퇴',
    message: '이 회원을 강제 탈퇴 처리하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    label: '탈퇴 처리',
    variant: 'danger',
  },
};

export function MemberDetailPage() {
  const { memberId } = useParams({ from: '/admin/members/$memberId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [action, setAction] = useState<Action>(null);

  const { data: member, isLoading } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () =>
      apiClient.get<ApiResponse<Member>>(`/members/${memberId}`).then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (act: NonNullable<Action>) =>
      apiClient.patch<ApiResponse<null>>(`/members/${memberId}/${act}`),
    onSuccess: (_, act) => {
      addToast('success', act === 'suspend' ? '계정이 정지되었습니다.' : '강제 탈퇴 처리되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['member', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setAction(null);
    },
    onError: () => {
      addToast('error', '처리 중 오류가 발생했습니다.');
      setAction(null);
    },
  });

  function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <div className="flex py-3 border-b border-gray-100 last:border-0">
        <dt className="w-32 text-sm text-gray-500 shrink-0">{label}</dt>
        <dd className="text-sm text-gray-800">{value}</dd>
      </div>
    );
  }

  return (
    <PageWrapper
      title="회원 상세"
      actions={
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: ROUTES.ADMIN_MEMBERS })}>
          <ArrowLeft size={14} className="mr-1" />
          목록으로
        </Button>
      }
    >
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="line" />)}
        </div>
      ) : member ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center gap-3">
            {member.profileImageUrl ? (
              <img src={member.profileImageUrl} className="w-24 h-24 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={36} className="text-gray-400" />
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{member.nickname}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
            <Badge variant={STATUS_VARIANT[member.status]}>{STATUS_LABEL[member.status]}</Badge>
            {member.bio && (
              <p className="text-sm text-gray-500 text-center leading-relaxed">{member.bio}</p>
            )}
            <div className="w-full grid grid-cols-3 gap-2 mt-2 text-center border-t border-gray-100 pt-4">
              <div>
                <p className="text-lg font-bold text-gray-900">{member.feedCount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">게시물</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{member.followersCount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">팔로워</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{member.followingsCount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">팔로잉</p>
              </div>
            </div>
          </div>

          {/* Detail info */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <TitleWrapper title="계정 정보" />
              <dl>
                <InfoRow label="회원 ID" value={`#${member.id}`} />
                <InfoRow label="상태" value={<Badge variant={STATUS_VARIANT[member.status]}>{STATUS_LABEL[member.status]}</Badge>} />
                <InfoRow label="가입일" value={format(new Date(member.createdAt), 'yyyy년 MM월 dd일')} />
                <InfoRow
                  label="마지막 로그인"
                  value={member.lastLoginAt ? format(new Date(member.lastLoginAt), 'yyyy.MM.dd HH:mm') : '없음'}
                />
              </dl>
            </div>

            {/* Actions */}
            {member.status !== 'WITHDRAWN' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <TitleWrapper title="관리 액션" />
                <div className="flex gap-3">
                  {member.status === 'ACTIVE' && (
                    <Button variant="danger" size="sm" onClick={() => setAction('suspend')}>
                      계정 정지
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => setAction('withdraw')}>
                    강제 탈퇴
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">회원을 찾을 수 없습니다.</p>
      )}

      {action && (
        <ConfirmModal
          open
          onClose={() => setAction(null)}
          onConfirm={() => mutation.mutate(action)}
          title={ACTION_CONFIG[action].title}
          message={ACTION_CONFIG[action].message}
          confirmLabel={ACTION_CONFIG[action].label}
          confirmVariant={ACTION_CONFIG[action].variant}
          loading={mutation.isPending}
        />
      )}
    </PageWrapper>
  );
}
