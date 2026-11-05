export const API_BASE_URL = '/api';

export const PAGE_SIZE = 20;
export const PAGE_SIZE_SMALL = 10;

export const STORAGE_KEY_ACCESS_TOKEN = 'sns_admin_token';
export const STORAGE_KEY_ADMIN_INFO = 'sns_admin_info';

export const ROUTES = {
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_FEEDS: '/admin/feeds',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_NOTICES: '/admin/notices',
  ADMIN_FAQ: '/admin/faqs',
} as const;
