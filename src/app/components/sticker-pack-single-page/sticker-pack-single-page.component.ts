import { Component, OnDestroy } from '@angular/core';
import { StickerPackOutput, StickerPackService } from '../../shared/services/sticker-pack.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Guid } from '../../shared/types';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { map, switchMap, tap } from 'rxjs/operators';
import { LoadFilePipe } from '../../shared/utilities/load-file.pipe';

@Component({
  selector: 'app-sticker-pack-single-page',
  templateUrl: './sticker-pack-single-page.component.html',
  styleUrls: ['./sticker-pack-single-page.component.scss'],
  providers: [LoadFilePipe]
})
export class StickerPackSinglePageComponent implements OnDestroy {

  private _subscription?: Subscription;
  private _loading = true;
  stickerPack?: StickerPackWithImagesOutput;
  isModalVisible = false;
  pickedImage?: string;
  isSendToTgModalVisible = false;
  username = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: NzMessageService,
    private loadFile: LoadFilePipe,
    private stickerPackService: StickerPackService
  ) {
    this._subscription = activatedRoute.paramMap
      .pipe(
        map(this.extractStickerPackIdFromParams),
        switchMap(stickerPackId => this.resolveStickerPackInfo$(stickerPackService, stickerPackId)),
        tap(() => this._loading = false)
      )
      .subscribe(stickerPack => this.stickerPack = stickerPack);
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  get isLoading(): boolean {
    return this._loading;
  }

  pickImage(image: string) {
    this.pickedImage = image;
    this.isModalVisible = true;
  }

  async copyLinkToClipboard(): Promise<void> {
    if (!this.stickerPack) {
      return;
    }

    await navigator.clipboard.writeText(`https://t.me/addstickers/${this.stickerPack.name}`);
    await this.messageService.create('success', 'Ссылка скопирована');
  }

  async confirmSendToTelegram(): Promise<void> {
    if (!this.stickerPack) {
      return;
    }

    const username = this.username.trim();

    if (!username) {
      this.messageService.error('Введите username');
      return;
    }

    try {
      await this.stickerPackService.sendStickerPackToTelegram({
        stickerPackName: `https://t.me/addstickers/${this.stickerPack.name}`,
        tgUsername: username
      });

      this.isSendToTgModalVisible = false;
    } catch (err) {
      console.log(err); // killme
      this.messageService.error('Произошла ошибка. Убедитесь, что у бота есть доступ к чату с вами');
    }
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
        switchMap(packs => {
          const found = packs.find(x => x.id === stickerPackId);

          return found ? of(found) : stickerPackService.getStickerPackById(stickerPackId);
        })
      );

    const imagesSource$ = stickerPackService.getStickerPackImages$(stickerPackId);

    return combineLatest([stickerPackSource$, imagesSource$])
      .pipe(map(([pack, images]) => ({ ...pack, images })));
  }
}

type StickerPackWithImagesOutput = StickerPackOutput & { images: string[] };
