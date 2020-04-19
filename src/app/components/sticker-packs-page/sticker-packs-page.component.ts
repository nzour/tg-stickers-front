import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StickerPackService } from '../../shared/services/sticker-pack.service';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Guid } from '../../shared/types';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sticker-packs-page',
  templateUrl: './sticker-packs-page.component.html',
  styleUrls: ['./sticker-packs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickerPacksPageComponent implements OnInit {

  private _stickerClapsBuffer = new Map<Guid, number>();
  private _clapsSubject$ = new Subject<Guid>();

  constructor(public stickerPackService: StickerPackService) { }

  ngOnInit(): void {
    this.stickerPackService.refreshStickers();

    this._clapsSubject$
      .pipe(
        debounceTime(500),
        switchMap(() => {
          const inputs = Array.from(this._stickerClapsBuffer)
            .map(([stickerPackId, clapsToAdd]) => {
              return { stickerPackId, clapsToAdd };
            });

          return this.stickerPackService.increaseClaps(inputs);
        })
      )
      .subscribe(() => {
        this.stickerPackService.refreshStickers();
        this._stickerClapsBuffer.clear();
      });
  }

  get faThumbsUp() {
    return faThumbsUp;
  }

  getBufferedClapsForStickerPack(stickerPackId: Guid): string {
    return String(this._stickerClapsBuffer.get(stickerPackId) || '');
  }

  bufferClap(stickerPackId: Guid): void {
    const currentClaps = this._stickerClapsBuffer.get(stickerPackId) || 0;

    this._stickerClapsBuffer.set(stickerPackId, currentClaps + 1);

    this._clapsSubject$.next(stickerPackId);
  }
}
