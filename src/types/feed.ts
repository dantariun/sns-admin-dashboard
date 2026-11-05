export type FeedStatus = 'PUBLIC' | 'PRIVATE' | 'BLINDED';

export type Feed = {
  id: number;
  author: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  content: string;
  mediaUrls: string[];
  likeCount: number;
  commentCount: number;
  reportCount: number;
  status: FeedStatus;
  tags: string[];
  createdAt: string;
};

export type FeedListParams = {
  page?: number;
  size?: number;
  keyword?: string;
  status?: FeedStatus | '';
  startDate?: string;
  endDate?: string;
};

export type Comment = {
  id: number;
  author: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  content: string;
  likeCount: number;
  createdAt: string;
};
