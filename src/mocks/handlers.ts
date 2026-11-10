import { http, HttpResponse } from 'msw';
import {
  MOCK_ADMIN,
  MOCK_DASHBOARD_STATS,
  MOCK_DASHBOARD_CHARTS,
  MOCK_MEMBERS,
  MOCK_RECENT_MEMBERS,
} from './mockData';
import type { MemberListParams } from '@/types/member';
import type { Report } from '@/types/report';

// ─── 최근 신고 5건 (대시보드용) ───────────────────────────────
const MOCK_RECENT_REPORTS: Report[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  targetType: (['FEED', 'COMMENT', 'MEMBER'] as const)[i % 3],
  targetId: i + 10,
  reporter: { id: i + 100, nickname: `reporter_${i + 1}` },
  reason: ['스팸', '욕설/혐오', '음란물', '개인정보 노출', '기타'][i],
  status: 'PENDING',
  processedAction: null,
  processedMemo: null,
  processedAt: null,
  createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
}));

export const handlers = [
  // ─── Auth ───────────────────────────────────────────────────
  http.post('/api/auth/login', () =>
    HttpResponse.json({
      success: true,
      data: {
        accessToken: 'mock-token-12345',
        adminInfo: MOCK_ADMIN,
      },
      message: '로그인 성공',
    }),
  ),

  // ─── Dashboard ──────────────────────────────────────────────
  http.get('/api/stats/summary', () =>
    HttpResponse.json({ success: true, data: MOCK_DASHBOARD_STATS }),
  ),

  http.get('/api/stats/charts', () =>
    HttpResponse.json({ success: true, data: MOCK_DASHBOARD_CHARTS }),
  ),

  http.get('/api/stats/recent-reports', () =>
    HttpResponse.json({ success: true, data: MOCK_RECENT_REPORTS }),
  ),

  http.get('/api/stats/recent-members', () =>
    HttpResponse.json({ success: true, data: MOCK_RECENT_MEMBERS }),
  ),

  // ─── Members ────────────────────────────────────────────────
  http.get('/api/members', ({ request }) => {
    const url = new URL(request.url);
    const params: MemberListParams = {
      page: Number(url.searchParams.get('page') ?? 0),
      size: Number(url.searchParams.get('size') ?? 10),
      keyword: url.searchParams.get('keyword') ?? '',
      status: (url.searchParams.get('status') as MemberListParams['status']) ?? '',
    };

    let list = [...MOCK_MEMBERS];
    if (params.keyword) {
      list = list.filter(
        (m) =>
          m.nickname.includes(params.keyword!) || m.email.includes(params.keyword!),
      );
    }
    if (params.status) {
      list = list.filter((m) => m.status === params.status);
    }

    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const total = list.length;
    const content = list.slice(page * size, page * size + size);

    return HttpResponse.json({
      success: true,
      data: {
        content,
        page,
        size,
        totalElements: total,
        totalPages: Math.ceil(total / size),
      },
    });
  }),

  http.get('/api/members/:id', ({ params }) => {
    const member = MOCK_MEMBERS.find((m) => m.id === Number(params.id));
    if (!member) return HttpResponse.json({ success: false, message: '없음' }, { status: 404 });
    return HttpResponse.json({ success: true, data: member });
  }),

  http.patch('/api/members/:id/suspend', ({ params }) => {
    const member = MOCK_MEMBERS.find((m) => m.id === Number(params.id));
    if (member) member.status = 'SUSPENDED';
    return HttpResponse.json({ success: true, message: '계정 정지 처리되었습니다.' });
  }),

  http.patch('/api/members/:id/withdraw', ({ params }) => {
    const member = MOCK_MEMBERS.find((m) => m.id === Number(params.id));
    if (member) member.status = 'WITHDRAWN';
    return HttpResponse.json({ success: true, message: '강제 탈퇴 처리되었습니다.' });
  }),
];
