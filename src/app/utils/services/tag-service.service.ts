import { RootInjectable } from '../../app.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guid, PaginatedData, Pagination, SearchType } from '../types';
import { map } from 'rxjs/operators';

@RootInjectable()
export class TagServiceService {

  constructor(private http: HttpClient) { }

  getAllTags(tagNameFilter: TagNameFilter, pagination: Pagination): Observable<PaginatedData<TagOutput>> {
    const fromObject = {
      ...tagNameFilter,
      limit: String(pagination.limit),
      offset: String(pagination.offset)
    };

    return this.http.get<PaginatedData<TagOutput>>('tags', { params: new HttpParams({ fromObject }) });
  }

  createTag(input: TagInput): Observable<TagOutput> {
    return this.http.post<TagOutput>(`tags`, input);
  }

  updateTag(tagId: Guid, input: TagInput): Observable<TagOutput> {
    return this.http.put<TagOutput>(`tags/${tagId}`, input);
  }

  isTagNameBusy(tagName: string): Observable<boolean> {
    return this.http.head<void>(`name-busy/${tagName}`)
      .pipe(
        map(() => true)
      );
  }
}

export interface TagNameFilter {
  name: string;
  searchType: SearchType;
}

export interface TagInput {
  name: string;
}

export interface TagOutput {
  id: Guid;
  name: string;
}
