export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  type?: string;
  priority?: string;
  status?: 'RUMOR' | 'CONFIRMED' | 'DEBUNKED' | string;
  createdAt?: string;
  [key: string]: any;
}

export interface NewsFeedResponse {
  items: NewsItem[];
  nextCursor?: string | null;
  hasMore?: boolean;
}
