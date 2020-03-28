import { Injectable } from '@angular/core';
import { AdminOutput, Guid, PaginatedData, Pagination, SearchType, SortType, Timestamp } from '../types';
import { TagOutput } from './tag.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';


let _state: StickerPackState = {
  total: 0,
  stickerPacks: Array<StickerPackOutput>(),
  pagination: { limit: 20, offset: 0 },
  sorting: { sortBy: 'createdAt', sortType: 'Descending' },
  filters: {
    nameFilter: { name: '', nameSearchType: 'Equals' },
    clapsFilter: { clapsCount: undefined, clapsSearchType: 'Equals' },
    tagsFilter: { tagsIds: [] }
  }
};

@Injectable()
export class StickerPackService {
  private store$ = new BehaviorSubject<StickerPackState>(_state);

  private _filters$ = this.store$.pipe(map(state => state.filters));
  private _sorting$ = this.store$.pipe(map(state => state.sorting));
  private _pagination$ = this.store$.pipe(map(state => state.pagination));
  private _total$ = this.store$.pipe(map(state => state.total));
  private _stickerPacks$ = this.store$.pipe(map(state => state.stickerPacks));

  constructor(private http: HttpClient) {
    combineLatest([this._filters$, this._sorting$, this._pagination$])
      .pipe(
        switchMap(([filters, sorting, pagination]) => {
          return this.getAllStickerPacks$(filters, sorting, pagination);
        })
      )
      .subscribe(output => {
        this.store$.next(_state = { ..._state, total: output.total, stickerPacks: output.data });
      });
  }

  get total$(): Observable<number> {
    return this._total$;
  }

  get stickerPacks$(): Observable<StickerPackOutput[]> {
    return this._stickerPacks$;
  }

  increaseClapsAndRefreshStickers(stickerPackId: Guid, clapsToAdd: number): void {
    this.http.post(`stickers${stickerPackId}`, { clapsToAdd })
      .subscribe(() => this.setPagination(_state.pagination));
  }

  setFilters(filters: StickerPackFilters): void {
    this.store$.next(_state = { ..._state, filters });
  }

  setSorting(sorting: StickerPackSorting): void {
    this.store$.next(_state = { ..._state, sorting });
  }

  setPagination(pagination: Pagination): void {
    this.store$.next(_state = { ..._state, pagination });
  }

  private getAllStickerPacks$(
    filters: StickerPackFilters,
    sorting: StickerPackSorting,
    pagination: Pagination
  ): Observable<PaginatedData<StickerPackOutput>> {
    const queryParams = StickerPackService.filtersToQueryParams(filters, sorting, pagination);
    return this.http.get<PaginatedData<StickerPackOutput>>(`stickerPacks${queryParams}`);
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

      // Не изменять проверку на !value. Т.е. значения с 0 или пустые строки тоже будут отфильтровываться
      if (null !== value && undefined !== value) {
        params.push({ key: property, value: String(value) });
      }
    }

    if (filters.tagsFilter) {
      params.push(
        ...filters.tagsFilter.tagsIds
          .map(tagId => ({ key: 'tagId', value: tagId }))
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
    tagsIds: Guid[]
  }
}

export type StickerPackSortableFields = 'createdAt' | 'donationCount' | 'clapsCount';

export interface StickerPackSorting {
  sortBy: StickerPackSortableFields,
  sortType: SortType
}
