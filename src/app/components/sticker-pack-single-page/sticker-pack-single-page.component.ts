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
    private activatedRoute: ActivatedRoute,
    private messageService: NzMessageService,
    stickerPackService: StickerPackService
  ) {
    this._subscription = activatedRoute.paramMap
      .pipe(
        map(this.extractStickerPackIdFromParams),
        switchMap(stickerPackId => this.resolveStickerPackInfo$(stickerPackService, stickerPackId))
      )
      .subscribe(stickerPack => this.stickerPack = stickerPack);
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  private extractStickerPackIdFromParams(params: Params): Guid {
    const stickerPackId = params.get('stickerPackId');

    if (!stickerPackId) {
      this.messageService.error('Route parameter stickerPackId is required');
      throw new Error('Route parameter stickerPackId is required');
    }

    return String(stickerPackId);
  }

  private resolveStickerPackInfo$(stickerPackService: StickerPackService, stickerPackId: Guid): Observable<StickerPackWithImagesOutput> {
    const stickerPackSource$ = stickerPackService.stickerPacks$
      .pipe(
        mergeAll(),
        first(stickerPack => stickerPack.id === stickerPackId),
      );

    const imagesSource$ = stickerPackService.getStickerPackImages$(stickerPackId);

    return combineLatest([stickerPackSource$, imagesSource$])
      .pipe(map(([pack, images]) => ({ ...pack, images })));
  }
}

type StickerPackWithImagesOutput = StickerPackOutput & { images: string[] };
