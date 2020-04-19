import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Guid, PaginatedData, Pagination, SearchType } from '../types';
import { finalize, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class TagService {
  private refreshSubject$ = new Subject();

  total$ = new BehaviorSubject<number>(0);
  tags$ = new BehaviorSubject<TagOutput[]>([]);

  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.refreshSubject$
      .pipe(
        switchMap(() => this.getAllTags$())
      )
      .subscribe(output => {
        this.total$.next(output.total);
        this.tags$.next(output.data);
      });
  }

  getAllTags$(): Observable<PaginatedData<TagOutput>> {
    this.loading$.next(true);

    return this.http.get<PaginatedData<TagOutput>>('tags')
      .pipe(
        finalize(() => this.loading$.next(false))
      );
  }

  createTag(name: string): Observable<TagOutput> {
    return this.http.post<TagOutput>(`tags`, { name });
  }

  updateTag(tagId: Guid, name: string): Observable<TagOutput> {
    return this.http.put<TagOutput>(`tags/${tagId}`, { name });
  }

  refreshTags(): void {
    this.refreshSubject$.next();
  }

  isTagNameBusy$(name: string): Observable<boolean> {
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
