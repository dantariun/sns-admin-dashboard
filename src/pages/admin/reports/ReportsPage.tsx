import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { SearchSection } from '@/components/common/wrapper/SearchSection';
import { TableSection } from '@/components/common/wrapper/TableSection';
import { Badge } from '@/components/ui/Badge/Badge';
import { Select } from '@/components/ui/Select/Select';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { SkeletonTable } from '@/components/ui/Skeleton/Skeleton';
import apiClient from '@/api/client';
import type { Report, ReportListParams, ReportStatus, ReportTargetType } from '@/types/report';
import type { ApiResponse, PageResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

const STATUS_OPTIONS = [
  { label: '전체 상태', value: '' },
  { label: '미처리', value: 'PENDING' },
  { label: '처리완료', value: 'PROCESSED' },
  { label: '기각', value: 'DISMISSED' },
];

const TARGET_OPTIONS = [
  { label: '전체 유형', value: '' },
  { label: '피드', value: 'FEED' },
  { label: '댓글', value: 'COMMENT' },
  { label: '회원', value: 'MEMBER' },
];

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

export function ReportsPage() {
  const [params, setParams] = useState<ReportListParams>({ page: 0, size: 20, status: '', targetType: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['reports', params],
    queryFn: () =>
      apiClient
        .get<ApiResponse<PageResponse<Report>>>('/reports', { params })
        .then((r) => r.data.data),
  });

  return (
    <PageWrapper title="신고 관리">
      <SearchSection>
        <div className="w-40">
          <Select
            options={STATUS_OPTIONS}
            value={params.status ?? ''}
            onChange={(e) => setParams((p) => ({ ...p, page: 0, status: e.target.value as ReportStatus | '' }))}
          />
        </div>
        <div className="w-40">
          <Select
            options={TARGET_OPTIONS}
            value={params.targetType ?? ''}
            onChange={(e) => setParams((p) => ({ ...p, page: 0, targetType: e.target.value as ReportTargetType | '' }))}
          />
        </div>
      </SearchSection>

      <TableSection>
        {isLoading ? (
          <SkeletonTable rows={10} cols={6} />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">유형</th>
                  <th className="px-4 py-3 text-left font-medium">사유</th>
                  <th className="px-4 py-3 text-left font-medium">신고자</th>
                  <th className="px-4 py-3 text-center font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">신고일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.content.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">#{r.id}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{TARGET_LABEL[r.targetType]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`${ROUTES.ADMIN_REPORTS}/${r.id}`}
                        className="text-gray-800 hover:text-primary-600"
                      >
                        {r.reason}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.reporter.nickname}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {format(new Date(r.createdAt), 'yyyy.MM.dd')}
                    </td>
                  </tr>
                ))}
                {data?.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      신고 내역이 없습니다.
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
