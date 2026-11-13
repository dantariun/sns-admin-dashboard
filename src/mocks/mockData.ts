import type { Member } from '@/types/member';
import type { Feed, Comment } from '@/types/feed';
import type { Report } from '@/types/report';
import type { Notice, Faq, FaqCategory } from '@/types/notice';
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

// ─── Notices ─────────────────────────────────────────────────
const NOTICE_TITLES = [
  '서비스 이용약관 개정 안내',
  '개인정보 처리방침 변경 안내',
  '앱 업데이트 안내 (v2.5.0)',
  '서버 점검 안내 (11월 20일)',
  '피드 기능 개선 안내',
  '신고 처리 기준 업데이트',
  '계정 보안 강화 안내',
  '크리스마스 이벤트 안내',
  '연말 결산 서비스 현황',
  '2027년 새해 인사',
];
const NOTICE_CONTENT = `안녕하세요, SNS 운영팀입니다.

서비스 품질 향상을 위해 아래와 같이 안내 드립니다.

주요 변경 사항을 꼼꼼히 확인해 주시고, 궁금하신 점은 고객센터를 통해 문의해 주시기 바랍니다.

감사합니다.`;

export const MOCK_NOTICES: Notice[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: NOTICE_TITLES[i % NOTICE_TITLES.length] + (i >= NOTICE_TITLES.length ? ` (${Math.floor(i / NOTICE_TITLES.length) + 1})` : ''),
  content: NOTICE_CONTENT,
  isPublished: i % 5 !== 4,
  createdAt: new Date(Date.now() - (15 - i) * 86400_000 * 5).toISOString(),
  updatedAt: new Date(Date.now() - (15 - i) * 86400_000 * 4).toISOString(),
}));

// ─── FAQs ────────────────────────────────────────────────────
const FAQ_DATA: { category: FaqCategory; question: string; answer: string }[] = [
  { category: 'ACCOUNT', question: '비밀번호를 잊어버렸어요.', answer: '로그인 화면에서 "비밀번호 찾기"를 눌러 가입 시 등록한 이메일로 재설정 링크를 받으세요.' },
  { category: 'ACCOUNT', question: '계정을 탈퇴하려면 어떻게 해야 하나요?', answer: '설정 > 계정 관리 > 탈퇴에서 직접 탈퇴할 수 있습니다. 탈퇴 후 30일간 복구가 가능하며 이후 모든 데이터는 삭제됩니다.' },
  { category: 'ACCOUNT', question: '닉네임은 언제든 변경할 수 있나요?', answer: '닉네임은 30일에 한 번 변경 가능합니다. 프로필 편집 화면에서 변경할 수 있습니다.' },
  { category: 'ACCOUNT', question: '이메일 주소를 변경하고 싶어요.', answer: '설정 > 계정 관리 > 이메일 변경에서 새 이메일을 입력하고 인증 절차를 완료하면 변경됩니다.' },
  { category: 'FEED', question: '피드에 올린 사진을 삭제하려면 어떻게 하나요?', answer: '게시물 우측 상단의 ⋯ 메뉴를 눌러 "삭제"를 선택하세요. 삭제된 게시물은 복구되지 않습니다.' },
  { category: 'FEED', question: '게시물에 최대 몇 장까지 사진을 올릴 수 있나요?', answer: '게시물 당 최대 10장의 사진 또는 동영상을 첨부할 수 있습니다.' },
  { category: 'FEED', question: '특정 사용자의 게시물이 보이지 않게 하려면요?', answer: '해당 계정 프로필에서 "차단" 또는 "숨기기"를 선택하면 됩니다.' },
  { category: 'REPORT', question: '신고한 게시물은 어떻게 처리되나요?', answer: '신고 접수 후 운영팀이 24시간 내 검토합니다. 위반 사항이 확인되면 경고·블라인드·계정 정지 등의 조치가 이루어집니다.' },
  { category: 'REPORT', question: '잘못된 신고를 취소할 수 있나요?', answer: '신고 접수 후 취소는 불가합니다. 운영팀 검토 과정에서 무효 신고로 판단되면 기각 처리됩니다.' },
  { category: 'REPORT', question: '계정이 정지되었어요. 어떻게 하나요?', answer: '고객센터 > 1:1 문의로 정지 사유와 이의 신청 내용을 보내주시면 검토 후 답변드립니다.' },
  { category: 'ETC', question: '알림이 오지 않아요.', answer: '기기 설정에서 앱 알림 권한을 확인하고, 앱 내 설정 > 알림에서 각 항목이 켜져 있는지 확인해 주세요.' },
  { category: 'ETC', question: '앱이 자꾸 튕겨요.', answer: '앱을 최신 버전으로 업데이트하고, 캐시를 삭제한 뒤 재시작해 보세요. 그래도 문제가 계속되면 고객센터로 문의해 주세요.' },
];

export const MOCK_FAQS: Faq[] = FAQ_DATA.map((d, i) => ({
  id: i + 1,
  category: d.category,
  question: d.question,
  answer: d.answer,
  createdAt: new Date(Date.now() - (12 - i) * 86400_000 * 7).toISOString(),
  updatedAt: new Date(Date.now() - (12 - i) * 86400_000 * 6).toISOString(),
}));
