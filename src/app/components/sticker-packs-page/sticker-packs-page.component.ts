import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StickerPackService } from '../../shared/services/sticker-pack.service';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sticker-packs-page',
  templateUrl: './sticker-packs-page.component.html',
  styleUrls: ['./sticker-packs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickerPacksPageComponent implements OnInit {

  constructor(public stickerPackService: StickerPackService) { }

  ngOnInit(): void {
    this.stickerPackService.refreshStickers();
  }

  get faThumbsUp() {
    return faThumbsUp;
  }
}
