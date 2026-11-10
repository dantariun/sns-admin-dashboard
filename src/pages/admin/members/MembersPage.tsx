import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';
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
import type { Member, MemberListParams, MemberStatus } from '@/types/member';
import type { ApiResponse, PageResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const STATUS_OPTIONS = [
  { label: '전체 상태', value: '' },
  { label: '활성', value: 'ACTIVE' },
  { label: '정지', value: 'SUSPENDED' },
  { label: '탈퇴', value: 'WITHDRAWN' },
];

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

export function MembersPage() {
  const [params, setParams] = useState<MemberListParams>({ page: 0, size: 20, keyword: '', status: '' });
  const [keyword, setKeyword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['members', params],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PageResponse<Member>>>('/members', { params })
        .then((r) => r.data.data),
  });

  function handleSearch() {
    setParams((p) => ({ ...p, page: 0, keyword }));
  }

  return (
    <PageWrapper title="회원 관리">
      <SearchSection>
        <div className="flex-1 min-w-48">
          <Input
            placeholder="닉네임 또는 이메일 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="w-40">
          <Select
            options={STATUS_OPTIONS}
            value={params.status ?? ''}
            onChange={(e) => setParams((p) => ({ ...p, page: 0, status: e.target.value as MemberStatus | '' }))}
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
                  <th className="px-4 py-3 text-left font-medium">닉네임</th>
                  <th className="px-4 py-3 text-left font-medium">이메일</th>
                  <th className="px-4 py-3 text-left font-medium text-center">상태</th>
                  <th className="px-4 py-3 text-left font-medium text-right">팔로워</th>
                  <th className="px-4 py-3 text-left font-medium text-right">게시물</th>
                  <th className="px-4 py-3 text-left font-medium">가입일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.content.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={`${ROUTES.ADMIN_MEMBERS}/${m.id}`}
                        className="flex items-center gap-2 group"
                      >
                        {m.profileImageUrl ? (
                          <img src={m.profileImageUrl} className="w-7 h-7 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            {m.nickname[0]}
                          </div>
                        )}
                        <span className="text-gray-800 group-hover:text-primary-600 font-medium">
                          {m.nickname}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{m.email}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={STATUS_VARIANT[m.status]}>{STATUS_LABEL[m.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {m.followersCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {m.feedCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {format(new Date(m.createdAt), 'yyyy.MM.dd')}
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
