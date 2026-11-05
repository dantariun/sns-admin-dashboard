import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/auth/login', () =>
    HttpResponse.json({
      success: true,
      data: {
        accessToken: 'mock-token-12345',
        adminInfo: { id: 1, name: '관리자', email: 'admin@sns.com' },
      },
      message: '로그인 성공',
    }),
  ),
];
