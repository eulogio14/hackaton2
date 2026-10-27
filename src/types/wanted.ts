export interface Wanted {
  id: string;
  name: string;
  epithet?: string;
  bounty?: number;
  crewId?: string;
  crewName?: string;
  fruit?: string;
  status?: string;
  imageUrl?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface WantedPage {
  content: Wanted[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
