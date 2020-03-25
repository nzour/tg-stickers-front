import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guid, TagOutput } from '../../utils/types';
import { map } from 'rxjs/operators';

@Injectable()
export class TagService {

  constructor(private http: HttpClient) { }

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
