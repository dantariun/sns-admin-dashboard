import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { TitleWrapper } from '@/components/common/wrapper/TitleWrapper';
import { TableSection } from '@/components/common/wrapper/TableSection';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton/Skeleton';
import { ConfirmModal } from '@/components/common/Modal/Modal';
import { useToastStore } from '@/store/toastStore';
import apiClient from '@/api/client';
import type { Feed, FeedStatus, Comment } from '@/types/feed';
import type { ApiResponse, PageResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const STATUS_VARIANT: Record<FeedStatus, 'success' | 'muted' | 'danger'> = {
  PUBLIC: 'success',
  PRIVATE: 'muted',
  BLINDED: 'danger',
};
const STATUS_LABEL: Record<FeedStatus, string> = {
  PUBLIC: '공개',
  PRIVATE: '비공개',
  BLINDED: '블라인드',
};

type TabKey = 'comments';

export function FeedDetailPage() {
  const { feedId } = useParams({ from: '/admin/feeds/$feedId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [mediaIndex, setMediaIndex] = useState(0);
  const [tab] = useState<TabKey>('comments');
  const [confirmAction, setConfirmAction] = useState<'blind' | 'unblind' | null>(null);

  const { data: feed, isLoading } = useQuery({
    queryKey: ['feed', feedId],
    queryFn: () =>
      apiClient.get<ApiResponse<Feed>>(`/feeds/${feedId}`).then((r) => r.data.data),
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['feed-comments', feedId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PageResponse<Comment>>>(`/feeds/${feedId}/comments`)
        .then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (action: 'blind' | 'unblind') =>
      apiClient.patch<ApiResponse<null>>(`/feeds/${feedId}/${action}`),
    onSuccess: (_, action) => {
      addToast('success', action === 'blind' ? '블라인드 처리되었습니다.' : '블라인드가 해제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['feed', feedId] });
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      setConfirmAction(null);
    },
    onError: () => {
      addToast('error', '처리 중 오류가 발생했습니다.');
      setConfirmAction(null);
    },
  });

  return (
    <PageWrapper
      title="피드 상세"
      actions={
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: ROUTES.ADMIN_FEEDS })}>
          <ArrowLeft size={14} className="mr-1" />
          목록으로
        </Button>
      }
    >
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Skeleton variant="rect" />
        </div>
      ) : feed ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Media viewer */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              {feed.mediaUrls.length > 0 ? (
                <img
                  src={feed.mediaUrls[mediaIndex]}
                  className="w-full h-full object-cover"
                  alt={`미디어 ${mediaIndex + 1}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  미디어 없음
                </div>
              )}
              {feed.mediaUrls.length > 1 && (
                <>
                  <button
                    onClick={() => setMediaIndex((i) => Math.max(0, i - 1))}
                    disabled={mediaIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setMediaIndex((i) => Math.min(feed.mediaUrls.length - 1, i + 1))}
                    disabled={mediaIndex === feed.mediaUrls.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {feed.mediaUrls.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setMediaIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === mediaIndex ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Feed info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {feed.author.profileImageUrl ? (
                    <img src={feed.author.profileImageUrl} className="w-8 h-8 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                      {feed.author.nickname[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800">{feed.author.nickname}</span>
                </div>
                <Badge variant={STATUS_VARIANT[feed.status]}>{STATUS_LABEL[feed.status]}</Badge>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{feed.content}</p>
              {feed.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {feed.tags.map((tag) => (
                    <span key={tag} className="text-xs text-primary-500">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-400 pt-1 border-t border-gray-100">
                <span className="flex items-center gap-1"><Heart size={13} /> {feed.likeCount.toLocaleString()}</span>
                <span className="flex items-center gap-1"><MessageCircle size={13} /> {feed.commentCount.toLocaleString()}</span>
                {feed.reportCount > 0 && (
                  <span className="text-red-400">신고 {feed.reportCount}건</span>
                )}
                <span className="ml-auto">{format(new Date(feed.createdAt), 'yyyy.MM.dd HH:mm')}</span>
              </div>
            </div>
            {/* Action */}
            <div className="px-4 pb-4 flex gap-2 border-t border-gray-100 pt-3">
              {feed.status !== 'BLINDED' ? (
                <Button variant="danger" size="sm" onClick={() => setConfirmAction('blind')}>
                  블라인드 처리
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setConfirmAction('unblind')}>
                  블라인드 해제
                </Button>
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <TitleWrapper title={`댓글 (${commentsData?.totalElements ?? 0})`} />
            <TableSection>
              {commentsLoading ? (
                <SkeletonTable rows={5} cols={2} />
              ) : (
                <div className="divide-y divide-gray-100">
                  {commentsData?.content.map((c) => (
                    <div key={c.id} className="px-4 py-3 flex gap-3">
                      {c.author.profileImageUrl ? (
                        <img src={c.author.profileImageUrl} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" alt="" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 shrink-0 mt-0.5">
                          {c.author.nickname[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-gray-700">{c.author.nickname}</span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {format(new Date(c.createdAt), 'MM/dd HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                          <Heart size={11} /> {c.likeCount}
                        </div>
                      </div>
                    </div>
                  ))}
                  {commentsData?.content.length === 0 && (
                    <p className="px-4 py-6 text-center text-sm text-gray-400">댓글이 없습니다.</p>
                  )}
                </div>
              )}
            </TableSection>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">피드를 찾을 수 없습니다.</p>
      )}

      {confirmAction && (
        <ConfirmModal
          open
          onClose={() => setConfirmAction(null)}
          onConfirm={() => mutation.mutate(confirmAction)}
          title={confirmAction === 'blind' ? '블라인드 처리' : '블라인드 해제'}
          message={
            confirmAction === 'blind'
              ? '이 피드를 블라인드 처리하시겠습니까? 작성자 외 다른 사용자에게 노출되지 않습니다.'
              : '블라인드를 해제하시겠습니까? 피드가 다시 공개됩니다.'
          }
          confirmLabel={confirmAction === 'blind' ? '블라인드' : '해제'}
          confirmVariant={confirmAction === 'blind' ? 'danger' : 'primary'}
          loading={mutation.isPending}
        />
      )}
    </PageWrapper>
  );
}
