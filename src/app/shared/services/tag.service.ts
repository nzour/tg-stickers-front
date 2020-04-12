import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { Guid, PaginatedData, Pagination, SearchType } from '../types';
import { distinctUntilChanged, finalize, map, pluck, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

const _initialState: TagState = {
  total: 0,
  tags: [],
  pagination: { limit: 20, offset: 0 },
  filter: { name: '', searchType: 'Equals' }
};

@Injectable()
export class TagService {
  private store$ = new BehaviorSubject<TagState>(_initialState);
  private refreshSubject$ = new Subject();

  total$ = this.store$.pipe(pluck('total'), distinctUntilChanged());
  tags$ = this.store$.pipe(pluck('tags'), distinctUntilChanged());
  pagination$ = this.store$.pipe(pluck('pagination'), distinctUntilChanged());
  filter$ = this.store$.pipe(pluck('filter'), distinctUntilChanged());

  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    combineLatest([this.filter$, this.pagination$, this.refreshSubject$])
      .pipe(
        switchMap(([filter, pagination]) => this.getAllTags$(filter, pagination))
      )
      .subscribe(output => {
        this.store$.next({ ...this.store$.value, total: output.total, tags: output.data });
      });
  }

  setPagination(pagination: Pagination): void {
    this.store$.next({ ...this.store$.value, pagination });
  }

  setFilter(filter: TagNameFilter): void {
    this.store$.next({ ...this.store$.value, filter });
  }

  getAllTags$(tagNameFilter: TagNameFilter, pagination: Pagination): Observable<PaginatedData<TagOutput>> {
    this.loading$.next(true);

    const fromObject = {
      ...tagNameFilter,
      limit: String(pagination.limit),
      offset: String(pagination.offset)
    };

    const params = new HttpParams({ fromObject });

    return this.http.get<PaginatedData<TagOutput>>('tags', { params })
      .pipe(finalize(() => this.loading$.next(false)));
  }

  createTag(name: string): Observable<TagOutput> {
    return this.http.post<TagOutput>(`tags`, { name })
      .pipe(finalize(this.refreshTags));
  }

  updateTag(tagId: Guid, name: string): Observable<TagOutput> {
    return this.http.put<TagOutput>(`tags/${tagId}`, { name })
      .pipe(finalize(this.refreshTags));
  }

  refreshTags(): void {
    this.refreshSubject$.next();
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
