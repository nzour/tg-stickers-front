import { Injectable } from '@angular/core';
import { AdminOutput, Guid, PaginatedData, Pagination, SearchType, SortType, Timestamp } from '../types';
import { TagOutput } from './tag.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay, distinctUntilChanged, finalize, map, switchMap } from 'rxjs/operators';


const _initialState: StickerPackState = {
  total: 0,
  stickerPacks: Array<StickerPackOutput>(),
  pagination: { limit: 20, offset: 0 },
  sorting: { sortBy: 'createdAt', sortType: 'Descending' },
  filters: {
    nameFilter: { name: '', nameSearchType: 'Equals' },
    clapsFilter: { clapsCount: undefined, clapsSearchType: 'Equals' },
    tagsFilter: { tagIds: [] }
  }
};

@Injectable()
export class StickerPackService {
  private store$ = new BehaviorSubject<StickerPackState>(_initialState);
  private refreshSubject$ = new Subject();

  filters$ = this.store$.pipe(map(s => s.filters), distinctUntilChanged());
  sorting$ = this.store$.pipe(map(s => s.sorting), distinctUntilChanged());
  pagination$ = this.store$.pipe(map(s => s.pagination), distinctUntilChanged());
  total$ = this.store$.pipe(map(s => s.total), distinctUntilChanged());
  stickerPacks$ = this.store$.pipe(map(s => s.stickerPacks), distinctUntilChanged());

  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    combineLatest([this.filters$, this.sorting$, this.pagination$, this.refreshSubject$])
      .pipe(
        switchMap(([filters, sorting, pagination]) => {
          return this.getStickerPacks$(filters, sorting, pagination);
        })
      )
      .subscribe(output => {
        this.store$.next({ ...this.store$.value, total: output.total, stickerPacks: output.data });
      });
  }

  createStickerPack$(input: StickerPackInput): Observable<StickerPackOutput> {
    return this.http.post<StickerPackOutput>('stickers', input)
      .pipe(finalize(this.refreshStickers));
  }

  increaseClapsAndRefreshStickers(stickerPackId: Guid, clapsToAdd: number): void {
    this.http.post(`stickers${stickerPackId}`, { clapsToAdd })
      .subscribe(this.refreshStickers);
  }

  setFilters(filters: StickerPackFilters): void {
    this.store$.next({ ...this.store$.value, filters: { ...this.store$.value.filters, ...filters } });
  }

  setSorting(sorting: StickerPackSorting): void {
    this.store$.next({ ...this.store$.value, sorting });
  }

  setPagination(pagination: Pagination): void {
    this.store$.next({ ...this.store$.value, pagination });
  }

  refreshStickers(): void {
    this.refreshSubject$.next();
  }

  getAllStickerPacks$(): Observable<PaginatedData<StickerPackOutput>> {
    return this.http
      .get<PaginatedData<StickerPackOutput>>(`stickers`);
  }

  getStickerPacks$(
    filters: StickerPackFilters,
    sorting: StickerPackSorting,
    pagination: Pagination
  ): Observable<PaginatedData<StickerPackOutput>> {
    this.loading$.next(true);

    const queryParams = StickerPackService.filtersToQueryParams(filters, sorting, pagination);

    return this.http
      .get<PaginatedData<StickerPackOutput>>(`stickers${queryParams}`)
      .pipe(
        delay(1000),
        finalize(() => this.loading$.next(false))
      );
  }

  private static filtersToQueryParams(
    filters: StickerPackFilters,
    sorting: StickerPackSorting,
    pagination: Pagination
  ): string {
    const paramsObject: any = {
      ...sorting,
      ...pagination,
      ...filters.nameFilter,
      ...filters.clapsFilter,
    };

    const params: Array<{ key: string, value: string }> = [];

    for (let property in paramsObject) {
      if (!paramsObject.hasOwnProperty(property)) {
        continue;
      }

      const value = paramsObject[property];

      // Не изменять проверку на !value. Т.к. значения с 0 или пустые строки тоже будут отфильтровываться
      if (null !== value && undefined !== value) {
        params.push({ key: property, value: String(value) });
      }
    }

    if (filters.tagsFilter) {
      params.push(
        ...filters.tagsFilter.tagIds.map(tagId => ({ key: 'tagIds', value: tagId }))
      );
    }

    return params.length
      ? '?' + params.map(({ key, value }) => `${key}=${value}`).join('&')
      : '';
  }
}

export interface StickerPackState {
  total: number,
  stickerPacks: StickerPackOutput[],
  sorting: StickerPackSorting,
  pagination: Pagination,
  filters: StickerPackFilters
}

export interface StickerPackOutput {
  id: Guid,
  name: string,
  sharedUrl: string,
  claps: number,
  createdAt: Timestamp,
  createdBy: AdminOutput,
  tags: TagOutput[]
}

export interface StickerPackFilters {
  nameFilter?: {
    name: string,
    nameSearchType: SearchType
  },
  clapsFilter?: {
    clapsCount?: number,
    clapsSearchType: SearchType
  },
  tagsFilter?: {
    tagIds: Guid[]
  }
}

export type StickerPackSortableFields = 'createdAt' | 'donationCount' | 'clapsCount';

export interface StickerPackSorting {
  sortBy: StickerPackSortableFields,
  sortType: SortType
}

export interface StickerPackInput {
  name: string,
  sharedUrl: string,
  tagIds: Guid[]
}
