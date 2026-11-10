import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, UserPlus, Image, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { StatCard } from '@/components/ui/StatCard/StatCard';
import { Badge } from '@/components/ui/Badge/Badge';
import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton/Skeleton';
import { PageWrapper } from '@/components/common/wrapper/PageWrapper';
import { TitleWrapper } from '@/components/common/wrapper/TitleWrapper';
import { TableSection } from '@/components/common/wrapper/TableSection';
import apiClient from '@/api/client';
import type { DashboardStats, DashboardCharts } from '@/types/stats';
import type { Member } from '@/types/member';
import type { Report } from '@/types/report';
import type { ApiResponse } from '@/types/api';

const TARGET_TYPE_LABEL: Record<Report['targetType'], string> = {
  FEED: '피드',
  COMMENT: '댓글',
  MEMBER: '회원',
};

const MEMBER_STATUS_VARIANT: Record<Member['status'], 'success' | 'warning' | 'danger'> = {
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  WITHDRAWN: 'danger',
};
const MEMBER_STATUS_LABEL: Record<Member['status'], string> = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  WITHDRAWN: '탈퇴',
};

function useDashboard() {
  const stats = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.get<ApiResponse<DashboardStats>>('/stats/summary').then((r) => r.data.data),
  });
  const charts = useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: () => apiClient.get<ApiResponse<DashboardCharts>>('/stats/charts').then((r) => r.data.data),
  });
  const recentReports = useQuery({
    queryKey: ['dashboard', 'recent-reports'],
    queryFn: () => apiClient.get<ApiResponse<Report[]>>('/stats/recent-reports').then((r) => r.data.data),
  });
  const recentMembers = useQuery({
    queryKey: ['dashboard', 'recent-members'],
    queryFn: () => apiClient.get<ApiResponse<Member[]>>('/stats/recent-members').then((r) => r.data.data),
  });
  return { stats, charts, recentReports, recentMembers };
}

function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'MM/dd', { locale: ko });
}

export function DashboardPage() {
  const { stats, charts, recentReports, recentMembers } = useDashboard();

  return (
    <PageWrapper title="대시보드">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-24">
              <Skeleton variant="line" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="총 회원수" value={stats.data?.totalMembers ?? 0} icon={<Users size={20} />} />
            <StatCard label="오늘 가입자" value={stats.data?.todaySignups ?? 0} icon={<UserPlus size={20} />} />
            <StatCard label="총 게시물" value={stats.data?.totalFeeds ?? 0} icon={<Image size={20} />} />
            <StatCard
              label="미처리 신고"
              value={stats.data?.pendingReports ?? 0}
              icon={<AlertTriangle size={20} />}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        {/* 가입자 추이 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <TitleWrapper title="최근 14일 가입자 추이" />
          {charts.isLoading ? (
            <div className="h-48"><Skeleton variant="rect" /></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={charts.data?.signupTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => String(v)} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} name="가입자" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 게시물 추이 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <TitleWrapper title="최근 14일 게시물 추이" />
          {charts.isLoading ? (
            <div className="h-48"><Skeleton variant="rect" /></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.data?.feedTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => String(v)} />
                <Bar dataKey="count" fill="#818cf8" radius={[3, 3, 0, 0]} name="게시물" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* 최근 신고 */}
        <div>
          <TitleWrapper title="최근 신고 5건" />
          <TableSection>
            {recentReports.isLoading ? (
              <SkeletonTable rows={5} cols={3} />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">유형</th>
                    <th className="px-4 py-3 text-left font-medium">사유</th>
                    <th className="px-4 py-3 text-left font-medium">일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentReports.data?.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Badge variant="info">{TARGET_TYPE_LABEL[r.targetType]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{r.reason}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {format(new Date(r.createdAt), 'MM/dd HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </TableSection>
        </div>

        {/* 최근 가입 회원 */}
        <div>
          <TitleWrapper title="최근 가입 회원 5명" />
          <TableSection>
            {recentMembers.isLoading ? (
              <SkeletonTable rows={5} cols={3} />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">닉네임</th>
                    <th className="px-4 py-3 text-left font-medium">상태</th>
                    <th className="px-4 py-3 text-left font-medium">가입일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentMembers.data?.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {m.profileImageUrl ? (
                            <img src={m.profileImageUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                              {m.nickname[0]}
                            </div>
                          )}
                          <span className="text-gray-800">{m.nickname}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={MEMBER_STATUS_VARIANT[m.status]}>
                          {MEMBER_STATUS_LABEL[m.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {format(new Date(m.createdAt), 'MM/dd')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </TableSection>
        </div>
      </div>
    </PageWrapper>
  );
}
