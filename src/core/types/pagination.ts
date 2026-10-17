export interface SearchInput<T> {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  filter?: T;
}

export interface PageOutput<T> {
  items: T[];
  count: number;
  total: number;
  pageSize: number;
  pageNumber: number;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  errors?: Record<string, string>;
}
