import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TagService } from '../../shared/services/tag.service';
import { FormControl } from '@angular/forms';
import { Guid } from '../../shared/types';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { StickerPackService } from '../../shared/services/sticker-pack.service';

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.component.html',
  styleUrls: ['./tags-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsPageComponent implements OnInit, OnDestroy {

  selectedTagsControl = new FormControl([]);

  private _selectedTagsSubscription?: Subscription;

  constructor(public tagService: TagService, private stickerPackService: StickerPackService) { }

  ngOnInit(): void {
    this.tagService.refreshTags();

    this._selectedTagsSubscription = this.selectedTagsControl
      .valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe((tagIds: Guid[]) => this.stickerPackService.setFilters({ tagsFilter: { tagIds } }));
  }

  ngOnDestroy(): void {
    this._selectedTagsSubscription?.unsubscribe();
  }

}
