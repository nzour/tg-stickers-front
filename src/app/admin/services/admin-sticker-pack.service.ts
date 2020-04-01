import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StickerPackOutput } from 'src/app/shared/services/sticker-pack.service';
import { Guid } from 'src/app/shared/types';

@Injectable()
export class AdminStickerPackService {

  constructor(private http: HttpClient) { }

  createStickerPack$(input: StickerPackInput): Observable<StickerPackOutput> {
    return this.http.post<StickerPackOutput>('stickers', input);
  }

}

export interface StickerPackInput {
  name: string,
  sharedUrl: string,
  tagIds: Guid[]
}
