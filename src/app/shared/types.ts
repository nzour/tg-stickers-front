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

export interface AdminOutput {
  id: Guid,
  name: string,
  login: string,
  createdAt: Timestamp
}

export interface HandledError {
  errorType: string,
  message: string
}

export function isHandledError(object: any): object is HandledError {
  return 'errorType' in object && 'message' in object;
}
