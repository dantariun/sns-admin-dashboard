export type Notice = {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Faq = {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export type FaqCategory = 'ACCOUNT' | 'FEED' | 'REPORT' | 'ETC';
