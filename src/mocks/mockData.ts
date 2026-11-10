import type { Member } from '@/types/member';
import type { Feed, Comment } from '@/types/feed';
import type { Report } from '@/types/report';
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

// ─── Feeds ───────────────────────────────────────────────────
const FEED_STATUSES: Feed['status'][] = ['PUBLIC', 'PUBLIC', 'PUBLIC', 'PRIVATE', 'BLINDED'];
const FEED_CONTENTS = [
  '오늘 카페에서 찍은 사진이에요 ☕',
  '주말 여행 다녀왔습니다 🏖️ 너무 좋았어요!',
  '새로 산 옷 어때요? 피드백 환영합니다',
  '오늘 만든 요리 🍳 레시피 궁금하신 분?',
  '일상 공유 #daily #vlog',
  '친구들과 함께한 소중한 순간',
  '운동 완료 💪 오늘도 화이팅!',
  '책 추천받습니다 📚 최근에 뭐 읽으셨나요?',
  '오늘 하늘이 너무 예뻐서 찍었어요 🌅',
  '새로운 취미 시작했어요 🎨',
];
const TAGS_POOL = [['일상', 'daily'], ['여행', 'travel', '맛집'], ['셀카', 'selfie'], ['음식', 'food', '맛스타그램'], ['운동', 'fitness']];

export const MOCK_FEEDS: Feed[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  author: {
    id: (i % 50) + 1,
    nickname: `user_${String((i % 50) + 1).padStart(3, '0')}`,
    profileImageUrl: i % 5 === 0 ? null : `https://i.pravatar.cc/80?img=${(i % 70) + 1}`,
  },
  content: FEED_CONTENTS[i % FEED_CONTENTS.length],
  mediaUrls: Array.from(
    { length: (i % 3) + 1 },
    (_, j) => `https://picsum.photos/seed/${i * 3 + j}/400/400`,
  ),
  likeCount: Math.floor(Math.random() * 300),
  commentCount: Math.floor(Math.random() * 50),
  reportCount: i % 10 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
  status: FEED_STATUSES[i % FEED_STATUSES.length],
  tags: TAGS_POOL[i % TAGS_POOL.length],
  createdAt: new Date(Date.now() - (60 - i) * 86400_000 * 2).toISOString(),
}));

// 피드별 댓글 (상세용)
export function getMockComments(feedId: number): Comment[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: feedId * 100 + i,
    author: {
      id: (i * 7 + feedId) % 50 + 1,
      nickname: `user_${String(((i * 7 + feedId) % 50) + 1).padStart(3, '0')}`,
      profileImageUrl: i % 3 === 0 ? null : `https://i.pravatar.cc/40?img=${(i * 3 + feedId) % 70}`,
    },
    content: ['좋아요!', '완전 공감해요 ㅎㅎ', '부럽다~', '저도 가고 싶어요!', '너무 예뻐요 ✨', '정보 감사해요', '팔로우할게요!', '다음에 같이 가요'][i],
    likeCount: Math.floor(Math.random() * 20),
    createdAt: new Date(Date.now() - (8 - i) * 3600_000).toISOString(),
  }));
}

// ─── Reports ─────────────────────────────────────────────────
const REPORT_REASONS = ['스팸/도배', '욕설/혐오 표현', '음란물', '개인정보 노출', '허위 정보', '저작권 침해', '기타'];
const REPORT_STATUSES: Report['status'][] = ['PENDING', 'PENDING', 'PROCESSED', 'DISMISSED'];

export const MOCK_REPORTS: Report[] = Array.from({ length: 40 }, (_, i) => {
  const status = REPORT_STATUSES[i % REPORT_STATUSES.length];
  return {
    id: i + 1,
    targetType: (['FEED', 'COMMENT', 'MEMBER'] as const)[i % 3],
    targetId: (i % 20) + 1,
    reporter: {
      id: (i * 3 + 10) % 50 + 1,
      nickname: `user_${String(((i * 3 + 10) % 50) + 1).padStart(3, '0')}`,
    },
    reason: REPORT_REASONS[i % REPORT_REASONS.length],
    status,
    processedAction: status === 'PROCESSED' ? (['WARNING', 'BLIND', 'SUSPEND', 'DISMISS'] as const)[i % 4] : null,
    processedMemo: status === 'PROCESSED' ? '검토 후 처리 완료' : null,
    processedAt: status === 'PROCESSED' ? new Date(Date.now() - i * 3600_000).toISOString() : null,
    createdAt: new Date(Date.now() - (40 - i) * 86400_000).toISOString(),
  };
});
