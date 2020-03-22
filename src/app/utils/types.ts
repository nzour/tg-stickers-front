export type Guid = string;

export type Timestamp = number;

export interface PaginatedData<T> {
  total: number;
  data: T[];
}

export interface Pagination {
  limit: number | null;
  offset: number | null;
}

export type SearchType = 'Equals' | 'Contains' | 'GreaterThan' | 'GreaterOrEquals' | 'LessThan' | 'LessOrEquals' ;
export type SortType = 'Ascending' | 'Descending';

