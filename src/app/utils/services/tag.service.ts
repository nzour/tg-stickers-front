import { RootInjectable } from '../../app.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedData, Pagination, SearchType, TagOutput } from '../types';

@RootInjectable()
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
}

export interface TagNameFilter {
  name: string;
  searchType: SearchType;
}
