import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Search, Image } from 'lucide-react';
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
import apiClient from '@/api/client';
import type { Feed, FeedListParams, FeedStatus } from '@/types/feed';
import type { ApiResponse, PageResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const STATUS_OPTIONS = [
  { label: '전체 상태', value: '' },
  { label: '공개', value: 'PUBLIC' },
  { label: '비공개', value: 'PRIVATE' },
  { label: '블라인드', value: 'BLINDED' },
];

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

export function FeedsPage() {
  const [params, setParams] = useState<FeedListParams>({ page: 0, size: 20, keyword: '', status: '' });
  const [keyword, setKeyword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['feeds', params],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PageResponse<Feed>>>('/feeds', { params })
        .then((r) => r.data.data),
  });

  function handleSearch() {
    setParams((p) => ({ ...p, page: 0, keyword }));
  }

  return (
    <PageWrapper title="피드 관리">
      <SearchSection>
        <div className="flex-1 min-w-48">
          <Input
            placeholder="내용 또는 작성자 닉네임 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="w-40">
          <Select
            options={STATUS_OPTIONS}
            value={params.status ?? ''}
            onChange={(e) => setParams((p) => ({ ...p, page: 0, status: e.target.value as FeedStatus | '' }))}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search size={14} className="mr-1.5" />
          검색
        </Button>
      </SearchSection>

      <TableSection>
        {isLoading ? (
          <SkeletonTable rows={10} cols={6} />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium w-12">미디어</th>
                  <th className="px-4 py-3 text-left font-medium">내용</th>
                  <th className="px-4 py-3 text-left font-medium">작성자</th>
                  <th className="px-4 py-3 text-center font-medium">상태</th>
                  <th className="px-4 py-3 text-right font-medium">좋아요/댓글</th>
                  <th className="px-4 py-3 text-left font-medium">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.content.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {f.mediaUrls.length > 0 ? (
                        <img
                          src={f.mediaUrls[0]}
                          className="w-10 h-10 rounded object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <Image size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <Link
                        to={`${ROUTES.ADMIN_FEEDS}/${f.id}`}
                        className="text-gray-800 hover:text-primary-600 line-clamp-2"
                      >
                        {f.content}
                      </Link>
                      {f.reportCount > 0 && (
                        <span className="text-xs text-red-500 mt-0.5 block">
                          신고 {f.reportCount}건
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {f.author.profileImageUrl ? (
                          <img src={f.author.profileImageUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            {f.author.nickname[0]}
                          </div>
                        )}
                        <span className="text-gray-600">{f.author.nickname}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={STATUS_VARIANT[f.status]}>{STATUS_LABEL[f.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {f.likeCount.toLocaleString()} / {f.commentCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {format(new Date(f.createdAt), 'yyyy.MM.dd')}
                    </td>
                  </tr>
                ))}
                {data?.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={data?.page ?? 0}
              totalPages={data?.totalPages ?? 0}
              totalElements={data?.totalElements ?? 0}
              onPageChange={(page) => setParams((p) => ({ ...p, page }))}
            />
          </>
        )}
      </TableSection>
    </PageWrapper>
  );
}
