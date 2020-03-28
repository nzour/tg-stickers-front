import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guid, PaginatedData, Pagination, SearchType } from '../types';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class TagService {

  constructor(private http: HttpClient) { }

  getAllTags(tagNameFilter: TagNameFilter, pagination: Pagination): Observable<PaginatedData<TagOutput>> {
    const fromObject = {
      ...tagNameFilter,
      limit: String(pagination.limit),
      offset: String(pagination.offset)
    };

    return this.http.get<PaginatedData<TagOutput>>('tags', { params: new HttpParams({ fromObject }) });
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

export interface TagOutput {
  id: Guid;
  name: string;
}

export interface TagNameFilter {
  name: string;
  searchType: SearchType;
}
