import { ROUTES } from '@/lib/constants';

export type NavItem = {
  label: string;
  path?: string;
  icon: string;
  children?: { label: string; path: string }[];
};

export const adminNavigation: NavItem[] = [
  { label: '대시보드', path: ROUTES.ADMIN_DASHBOARD, icon: 'LayoutDashboard' },
  {
    label: '회원',
    icon: 'Users',
    children: [{ label: '회원 관리', path: ROUTES.ADMIN_MEMBERS }],
  },
  {
    label: '피드',
    icon: 'Image',
    children: [{ label: '피드 관리', path: ROUTES.ADMIN_FEEDS }],
  },
  { label: '신고', path: ROUTES.ADMIN_REPORTS, icon: 'Flag' },
  {
    label: '공지·FAQ',
    icon: 'Bell',
    children: [
      { label: '공지사항', path: ROUTES.ADMIN_NOTICES },
      { label: 'FAQ', path: ROUTES.ADMIN_FAQ },
    ],
  },
];
