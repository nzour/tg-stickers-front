import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError, finalize } from 'rxjs/operators';
import { TagOutput, TagService } from 'src/app/shared/services/tag.service';
import { AdminStickerPackService } from '../../services/admin-sticker-pack.service';
import { isHandledError } from 'src/app/shared/types';

const URL_REGEX_PATTERN = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

@Component({
  selector: 'app-create-sticker-pack',
  templateUrl: 'create-sticker-pack.component.html',
  styleUrls: ['create-sticker-pack.component.scss']
})
export class CreateStickerPackComponent implements OnInit {

  tags = Array<TagOutput>();
  tagsLoading = true;

  loading = false;

  stickerPackForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    sharedUrl: new FormControl('', [Validators.required, Validators.pattern(URL_REGEX_PATTERN)]),
    tagIds: new FormControl([])
  });

  constructor(
    private stickerPackService: AdminStickerPackService,
    private tagService: TagService,
    private messageService: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tagService
      .getAllTags$({ name: '', searchType: 'Equals' }, { limit: 100, offset: 0 })
      .pipe(
        finalize(() => this.tagsLoading = false)
      )
      .subscribe(tags => this.tags = tags.data);
  }

  submit(): void {
    if (!this.stickerPackForm.valid || this.loading) {
      return;
    }

    this.loading = true;

    this.stickerPackService.createStickerPack$(this.stickerPackForm.value)
      .pipe(
        catchError(err => {
          this.handleError(err);
          throw err;
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(async () => await this.router.navigate(['/']));
  }

  private handleError(errResponse: HttpErrorResponse): void {
    if (isHandledError(errResponse.error)) {
      this.messageService.error(`[${errResponse.error.errorType}]: ${errResponse.error.message}`, { nzDuration: 5000 });
      return;
    }

    this.messageService.error('Возникла непредвиденная ошибка!');
  }
}
