import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TagService } from '../../shared/services/tag.service';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Guid, SearchType } from '../../shared/types';

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.component.html',
  styleUrls: ['./tags-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsPageComponent {

  nameControl = new FormControl('');
  strongSearchControl = new FormControl(false);

  private checkedTags = new Set<Guid>();

  @Output() checkedTagsChanged = new EventEmitter<Guid[]>();

  constructor(public tagService: TagService) {
    // todo: реализовать пагинацию
    this.nameControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe(name => {
        const searchType = this.mapSearchType(this.strongSearchControl.value);
        this.tagService.setFilter({ name, searchType });
      });

    this.strongSearchControl.valueChanges
      .pipe(
        map(this.mapSearchType),
        filter(() => !!this.nameControl.value)
      )
      .subscribe(searchType =>
        this.tagService.setFilter({ searchType, name: this.nameControl.value })
      );
  }

  isTagChecked(tagId: Guid): boolean {
    return this.checkedTags.has(tagId);
  }

  checkTag(tagId: Guid, checkMode: boolean): void {
    checkMode
      ? this.checkedTags.add(tagId)
      : this.checkedTags.delete(tagId);

    this.checkedTagsChanged.next([...this.checkedTags]);
  }

  private mapSearchType = (checked: boolean): SearchType => checked ? 'Equals' : 'Contains';
}
