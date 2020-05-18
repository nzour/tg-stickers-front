import { Component, OnDestroy } from '@angular/core';
import { StickerPackOutput, StickerPackService } from '../../shared/services/sticker-pack.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Guid } from '../../shared/types';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { first, map, mergeAll, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sticker-pack-single-page',
  templateUrl: './sticker-pack-single-page.component.html',
  styleUrls: ['./sticker-pack-single-page.component.scss']
})
export class StickerPackSinglePageComponent implements OnDestroy {

  private _subscription?: Subscription;
  stickerPack?: StickerPackWithImagesOutput;

  constructor(
    private stickerPackService: StickerPackService,
    private activatedRoute: ActivatedRoute,
    private messageService: NzMessageService
  ) {
    this._subscription = activatedRoute.paramMap
      .pipe(
        map(this.stickerPackIdFromParams),
        switchMap(stickerPackId => this.resolveStickerPackInfo$(stickerPackService, stickerPackId))
      )
      .subscribe(stickerPack => this.stickerPack = stickerPack);
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  private stickerPackIdFromParams(params: Params): Guid {
    const stickerPackId = params.get('stickerPackId');

    if (!stickerPackId) {
      this.messageService.error('Route parameter stickerPackId is required');
      throw new Error('Route parameter stickerPackId is required');
    }

    return String(stickerPackId);
  }

  private resolveStickerPackInfo$(stickerPackService: StickerPackService, stickerPackId: Guid): Observable<StickerPackWithImagesOutput> {
    const getStickerPack = () => {
      return stickerPackService.stickerPacks$
        .pipe(
          mergeAll(),
          first(stickerPack => stickerPack.id === stickerPackId)
        );
    };

    const toFullOutput = ([images, stickerPack]: [string[], StickerPackOutput]) => ({ ...stickerPack!, images });

    const sources: [Observable<string[]>, Observable<StickerPackOutput>] = [
      stickerPackService.getStickerPackImages$(stickerPackId),
      getStickerPack()
    ];

    return combineLatest(sources).pipe(map(toFullOutput));
  }
}

type StickerPackWithImagesOutput = StickerPackOutput & { images: string[] };
