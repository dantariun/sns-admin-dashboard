import type { Member } from '@/types/member';
import type { DashboardStats, DashboardCharts } from '@/types/stats';

export const MOCK_ADMIN = {
  id: 1,
  name: '관리자',
  email: 'admin@sns.com',
};

// ─── Dashboard ───────────────────────────────────────────────
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalMembers: 12_480,
  todaySignups: 47,
  totalFeeds: 89_312,
  pendingReports: 23,
};

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export const MOCK_DASHBOARD_CHARTS: DashboardCharts = {
  signupTrend: Array.from({ length: 14 }, (_, i) => ({
    date: dateStr(13 - i),
    count: 20 + Math.floor(Math.random() * 60),
  })),
  feedTrend: Array.from({ length: 14 }, (_, i) => ({
    date: dateStr(13 - i),
    count: 100 + Math.floor(Math.random() * 300),
  })),
};

// ─── Members ─────────────────────────────────────────────────
const STATUSES: Member['status'][] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'SUSPENDED', 'WITHDRAWN'];

export const MOCK_MEMBERS: Member[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nickname: `user_${String(i + 1).padStart(3, '0')}`,
  email: `user${i + 1}@example.com`,
  profileImageUrl: i % 5 === 0 ? null : `https://i.pravatar.cc/80?img=${(i % 70) + 1}`,
  bio: i % 3 === 0 ? null : `안녕하세요, ${i + 1}번 회원입니다.`,
  status: STATUSES[i % STATUSES.length],
  followersCount: Math.floor(Math.random() * 500),
  followingsCount: Math.floor(Math.random() * 300),
  feedCount: Math.floor(Math.random() * 200),
  createdAt: new Date(Date.now() - (50 - i) * 86400_000 * 3).toISOString(),
  lastLoginAt: i % 7 === 0 ? null : new Date(Date.now() - i * 3600_000).toISOString(),
}));

// 최근 가입 5명 (대시보드용)
export const MOCK_RECENT_MEMBERS = [...MOCK_MEMBERS]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);
