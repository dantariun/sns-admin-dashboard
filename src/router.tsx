import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/admin/dashboard/DashboardPage';
import { MembersPage } from '@/pages/admin/members/MembersPage';
import { MemberDetailPage } from '@/pages/admin/members/MemberDetailPage';
import { FeedsPage } from '@/pages/admin/feeds/FeedsPage';
import { FeedDetailPage } from '@/pages/admin/feeds/FeedDetailPage';
import { ReportsPage } from '@/pages/admin/reports/ReportsPage';
import { ReportDetailPage } from '@/pages/admin/reports/ReportDetailPage';
import { NoticesPage } from '@/pages/admin/notices/NoticesPage';
import { NoticeDetailPage } from '@/pages/admin/notices/NoticeDetailPage';
import { NoticeEditPage } from '@/pages/admin/notices/NoticeEditPage';
import { FaqsPage } from '@/pages/admin/faqs/FaqsPage';
import { FaqDetailPage } from '@/pages/admin/faqs/FaqDetailPage';
import { FaqEditPage } from '@/pages/admin/faqs/FaqEditPage';
import { useAuthStore } from '@/store/authStore';

const rootRoute = createRootRoute({ component: Outlet });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const adminRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/admin/dashboard' }); },
  component: () => null,
});

const dashboardRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/dashboard', component: DashboardPage });
const membersRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/members', component: MembersPage });
const memberDetailRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/members/$memberId', component: MemberDetailPage });
const feedsRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/feeds', component: FeedsPage });
const feedDetailRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/feeds/$feedId', component: FeedDetailPage });
const reportsRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/reports', component: ReportsPage });
const reportDetailRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/reports/$reportId', component: ReportDetailPage });
const noticesRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/notices', component: NoticesPage });
const noticeNewRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/notices/new', component: NoticeEditPage });
const noticeDetailRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/notices/$noticeId', component: NoticeDetailPage });
const noticeEditRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/notices/$noticeId/edit', component: NoticeEditPage });
const faqsRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/faqs', component: FaqsPage });
const faqNewRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/faqs/new', component: FaqEditPage });
const faqDetailRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/faqs/$faqId', component: FaqDetailPage });
const faqEditRoute = createRoute({ getParentRoute: () => adminRootRoute, path: '/faqs/$faqId/edit', component: FaqEditPage });

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRootRoute.addChildren([
    dashboardRoute,
    membersRoute,
    memberDetailRoute,
    feedsRoute,
    feedDetailRoute,
    reportsRoute,
    reportDetailRoute,
    noticesRoute,
    noticeNewRoute,
    noticeDetailRoute,
    noticeEditRoute,
    faqsRoute,
    faqNewRoute,
    faqDetailRoute,
    faqEditRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
