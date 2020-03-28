export type Guid = string;
export type Timestamp = number;

export type SearchType = 'Equals' | 'Contains' | 'GreaterThan' | 'GreaterOrEquals' | 'LessThan' | 'LessOrEquals' ;
export type SortType = 'Ascending' | 'Descending';

export interface PaginatedData<T> {
  total: number;
  data: T[];
}

export interface Pagination {
  limit: number | null;
  offset: number | null;
}
