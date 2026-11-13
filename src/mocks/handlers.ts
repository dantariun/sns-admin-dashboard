import { http, HttpResponse } from 'msw';
import {
  MOCK_ADMIN,
  MOCK_DASHBOARD_STATS,
  MOCK_DASHBOARD_CHARTS,
  MOCK_MEMBERS,
  MOCK_RECENT_MEMBERS,
  MOCK_FEEDS,
  getMockComments,
  MOCK_REPORTS,
  MOCK_NOTICES,
  MOCK_FAQS,
} from './mockData';
import type { MemberListParams } from '@/types/member';
import type { FeedListParams, FeedStatus } from '@/types/feed';
import type { Report, ReportStatus, ReportTargetType } from '@/types/report';
import type { Notice, Faq, FaqCategory } from '@/types/notice';

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

// 인메모리 mutable 복사본
let notices = MOCK_NOTICES.map((n) => ({ ...n }));
let noticseNextId = notices.length + 1;
let faqs = MOCK_FAQS.map((f) => ({ ...f }));
let faqsNextId = faqs.length + 1;

export const handlers = [
  // ─── Auth ───────────────────────────────────────────────────
  http.post('/api/auth/login', () =>
    HttpResponse.json({
      success: true,
      data: { accessToken: 'mock-token-12345', adminInfo: MOCK_ADMIN },
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
    if (params.keyword) list = list.filter((m) => m.nickname.includes(params.keyword!) || m.email.includes(params.keyword!));
    if (params.status) list = list.filter((m) => m.status === params.status);
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const content = list.slice(page * size, page * size + size);
    return HttpResponse.json({ success: true, data: { content, page, size, totalElements: list.length, totalPages: Math.ceil(list.length / size) } });
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

  // ─── Feeds ──────────────────────────────────────────────────
  http.get('/api/feeds', ({ request }) => {
    const url = new URL(request.url);
    const params: FeedListParams = {
      page: Number(url.searchParams.get('page') ?? 0),
      size: Number(url.searchParams.get('size') ?? 20),
      keyword: url.searchParams.get('keyword') ?? '',
      status: (url.searchParams.get('status') as FeedStatus | '') ?? '',
    };
    let list = [...MOCK_FEEDS];
    if (params.keyword) list = list.filter((f) => f.content.includes(params.keyword!) || f.author.nickname.includes(params.keyword!));
    if (params.status) list = list.filter((f) => f.status === params.status);
    const page = params.page ?? 0;
    const size = params.size ?? 20;
    const content = list.slice(page * size, page * size + size);
    return HttpResponse.json({ success: true, data: { content, page, size, totalElements: list.length, totalPages: Math.ceil(list.length / size) } });
  }),
  http.get('/api/feeds/:id', ({ params }) => {
    const feed = MOCK_FEEDS.find((f) => f.id === Number(params.id));
    if (!feed) return HttpResponse.json({ success: false, message: '없음' }, { status: 404 });
    return HttpResponse.json({ success: true, data: feed });
  }),
  http.get('/api/feeds/:id/comments', ({ params }) => {
    const comments = getMockComments(Number(params.id));
    return HttpResponse.json({ success: true, data: { content: comments, page: 0, size: 20, totalElements: comments.length, totalPages: 1 } });
  }),
  http.patch('/api/feeds/:id/blind', ({ params }) => {
    const feed = MOCK_FEEDS.find((f) => f.id === Number(params.id));
    if (feed) feed.status = 'BLINDED';
    return HttpResponse.json({ success: true, message: '피드가 블라인드 처리되었습니다.' });
  }),
  http.patch('/api/feeds/:id/unblind', ({ params }) => {
    const feed = MOCK_FEEDS.find((f) => f.id === Number(params.id));
    if (feed) feed.status = 'PUBLIC';
    return HttpResponse.json({ success: true, message: '블라인드가 해제되었습니다.' });
  }),

  // ─── Reports ────────────────────────────────────────────────
  http.get('/api/reports', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);
    const status = (url.searchParams.get('status') as ReportStatus | '') ?? '';
    const targetType = (url.searchParams.get('targetType') as ReportTargetType | '') ?? '';
    let list = [...MOCK_REPORTS];
    if (status) list = list.filter((r) => r.status === status);
    if (targetType) list = list.filter((r) => r.targetType === targetType);
    const content = list.slice(page * size, page * size + size);
    return HttpResponse.json({ success: true, data: { content, page, size, totalElements: list.length, totalPages: Math.ceil(list.length / size) } });
  }),
  http.get('/api/reports/:id', ({ params }) => {
    const report = MOCK_REPORTS.find((r) => r.id === Number(params.id));
    if (!report) return HttpResponse.json({ success: false, message: '없음' }, { status: 404 });
    return HttpResponse.json({ success: true, data: report });
  }),
  http.post('/api/reports/:id/process', async ({ params, request }) => {
    const report = MOCK_REPORTS.find((r) => r.id === Number(params.id));
    const body = await request.json() as { action: string; memo?: string };
    if (report) {
      report.status = 'PROCESSED';
      report.processedAction = body.action as Report['processedAction'];
      report.processedMemo = body.memo ?? null;
      report.processedAt = new Date().toISOString();
    }
    return HttpResponse.json({ success: true, message: '신고가 처리되었습니다.' });
  }),
  http.post('/api/reports/:id/dismiss', ({ params }) => {
    const report = MOCK_REPORTS.find((r) => r.id === Number(params.id));
    if (report) { report.status = 'DISMISSED'; report.processedAt = new Date().toISOString(); }
    return HttpResponse.json({ success: true, message: '신고가 기각되었습니다.' });
  }),

  // ─── Notices ────────────────────────────────────────────────
  http.get('/api/notices', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);
    const keyword = url.searchParams.get('keyword') ?? '';
    let list = [...notices];
    if (keyword) list = list.filter((n) => n.title.includes(keyword));
    list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const content = list.slice(page * size, page * size + size);
    return HttpResponse.json({ success: true, data: { content, page, size, totalElements: list.length, totalPages: Math.ceil(list.length / size) } });
  }),
  http.get('/api/notices/:id', ({ params }) => {
    const notice = notices.find((n) => n.id === Number(params.id));
    if (!notice) return HttpResponse.json({ success: false, message: '없음' }, { status: 404 });
    return HttpResponse.json({ success: true, data: notice });
  }),
  http.post('/api/notices', async ({ request }) => {
    const body = await request.json() as Pick<Notice, 'title' | 'content' | 'isPublished'>;
    const now = new Date().toISOString();
    const created: Notice = { id: noticseNextId++, ...body, createdAt: now, updatedAt: now };
    notices.unshift(created);
    return HttpResponse.json({ success: true, data: created, message: '공지사항이 등록되었습니다.' }, { status: 201 });
  }),
  http.put('/api/notices/:id', async ({ params, request }) => {
    const body = await request.json() as Pick<Notice, 'title' | 'content' | 'isPublished'>;
    const idx = notices.findIndex((n) => n.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: '없음' }, { status: 404 });
    notices[idx] = { ...notices[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: notices[idx], message: '수정되었습니다.' });
  }),
  http.delete('/api/notices/:id', ({ params }) => {
    notices = notices.filter((n) => n.id !== Number(params.id));
    return HttpResponse.json({ success: true, message: '삭제되었습니다.' });
  }),

  // ─── FAQs ───────────────────────────────────────────────────
  http.get('/api/faqs', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);
    const keyword = url.searchParams.get('keyword') ?? '';
    const category = (url.searchParams.get('category') as FaqCategory | '') ?? '';
    let list = [...faqs];
    if (keyword) list = list.filter((f) => f.question.includes(keyword) || f.answer.includes(keyword));
    if (category) list = list.filter((f) => f.category === category);
    list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const content = list.slice(page * size, page * size + size);
    return HttpResponse.json({ success: true, data: { content, page, size, totalElements: list.length, totalPages: Math.ceil(list.length / size) } });
  }),
  http.get('/api/faqs/:id', ({ params }) => {
    const faq = faqs.find((f) => f.id === Number(params.id));
    if (!faq) return HttpResponse.json({ success: false, message: '없음' }, { status: 404 });
    return HttpResponse.json({ success: true, data: faq });
  }),
  http.post('/api/faqs', async ({ request }) => {
    const body = await request.json() as Pick<Faq, 'category' | 'question' | 'answer'>;
    const now = new Date().toISOString();
    const created: Faq = { id: faqsNextId++, ...body, createdAt: now, updatedAt: now };
    faqs.unshift(created);
    return HttpResponse.json({ success: true, data: created, message: 'FAQ가 등록되었습니다.' }, { status: 201 });
  }),
  http.put('/api/faqs/:id', async ({ params, request }) => {
    const body = await request.json() as Pick<Faq, 'category' | 'question' | 'answer'>;
    const idx = faqs.findIndex((f) => f.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: '없음' }, { status: 404 });
    faqs[idx] = { ...faqs[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: faqs[idx], message: '수정되었습니다.' });
  }),
  http.delete('/api/faqs/:id', ({ params }) => {
    faqs = faqs.filter((f) => f.id !== Number(params.id));
    return HttpResponse.json({ success: true, message: '삭제되었습니다.' });
  }),
];
