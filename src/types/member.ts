export type MemberStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

export type Member = {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  bio: string | null;
  status: MemberStatus;
  followersCount: number;
  followingsCount: number;
  feedCount: number;
  createdAt: string;
  lastLoginAt: string | null;
};

export type MemberListParams = {
  page?: number;
  size?: number;
  keyword?: string;
  status?: MemberStatus | '';
  startDate?: string;
  endDate?: string;
};
