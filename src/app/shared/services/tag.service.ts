import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Guid, PaginatedData, Pagination, SearchType } from '../types';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

let _state: TagState = {
  total: 0,
  tags: [],
  pagination: { limit: 20, offset: 0 },
  filter: { name: '', searchType: 'Equals' }
};

@Injectable()
export class TagService {
  private store$ = new BehaviorSubject<TagState>(_state);

  total$ = this.store$.pipe(map(state => state.total));
  tags$ = this.store$.pipe(map(state => state.tags));
  pagination$ = this.store$.pipe(map(state => state.pagination));
  filter$ = this.store$.pipe(map(state => state.filter));

  constructor(private http: HttpClient) {
    combineLatest([this.filter$, this.pagination$])
      .pipe(
        switchMap(([filter, pagination]) => this.getAllTags(filter, pagination))
      )
      .subscribe(output => _state = { ..._state, total: output.total, tags: output.data });
  }

  setPagination(pagination: Pagination): void {
    this.store$.next(_state = { ..._state, pagination });
  }

  setFilter(filter: TagNameFilter): void {
    this.store$.next(_state = { ..._state, filter });
  }

  getAllTags(tagNameFilter: TagNameFilter, pagination: Pagination): Observable<PaginatedData<TagOutput>> {
    const fromObject = {
      ...tagNameFilter,
      limit: String(pagination.limit),
      offset: String(pagination.offset)
    };

    const params = new HttpParams({ fromObject });

    return this.http.get<PaginatedData<TagOutput>>('tags', { params });
  }

  createTag(name: string): Observable<TagOutput> {
    return this.http.post<TagOutput>(`tags`, { name });
  }

  updateTag(tagId: Guid, name: string): Observable<TagOutput> {
    return this.http.put<TagOutput>(`tags/${tagId}`, { name });
  }

  isTagNameBusy(name: string): Observable<boolean> {
    return this.http.head<void>(`name-busy/${name}`)
      .pipe(
        map(() => true)
      );
  }
}

export interface TagState {
  total: number,
  tags: TagOutput[],
  pagination: Pagination,
  filter: TagNameFilter
}

export interface TagOutput {
  id: Guid;
  name: string;
}

export interface TagNameFilter {
  name: string;
  searchType: SearchType;
}
