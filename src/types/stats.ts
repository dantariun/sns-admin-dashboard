export type DashboardStats = {
  totalMembers: number;
  todaySignups: number;
  totalFeeds: number;
  pendingReports: number;
};

export type DailyCount = {
  date: string;
  count: number;
};

export type DashboardCharts = {
  signupTrend: DailyCount[];
  feedTrend: DailyCount[];
};
