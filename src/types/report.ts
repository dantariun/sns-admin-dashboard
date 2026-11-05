export type ReportStatus = 'PENDING' | 'PROCESSED' | 'DISMISSED';
export type ReportTargetType = 'FEED' | 'COMMENT' | 'MEMBER';
export type ReportAction = 'WARNING' | 'BLIND' | 'SUSPEND' | 'DISMISS';

export type Report = {
  id: number;
  targetType: ReportTargetType;
  targetId: number;
  reporter: {
    id: number;
    nickname: string;
  };
  reason: string;
  status: ReportStatus;
  processedAction: ReportAction | null;
  processedMemo: string | null;
  processedAt: string | null;
  createdAt: string;
};

export type ReportListParams = {
  page?: number;
  size?: number;
  status?: ReportStatus | '';
  targetType?: ReportTargetType | '';
};
