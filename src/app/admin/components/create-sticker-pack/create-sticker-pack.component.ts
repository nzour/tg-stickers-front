import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError, finalize, map } from 'rxjs/operators';
import { TagOutput, TagService } from 'src/app/shared/services/tag.service';
import { isHandledError } from 'src/app/shared/types';
import { StickerPackService } from '../../../shared/services/sticker-pack.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-sticker-pack',
  templateUrl: 'create-sticker-pack.component.html',
  styleUrls: ['create-sticker-pack.component.scss']
})
export class CreateStickerPackComponent implements OnInit {

  tags = Array<TagOutput>();
  loading = false;

  stickerPackForm = new FormGroup({
    name: new FormControl('', [Validators.required], this.assertStickerPackWithNameExists.bind(this)),
    alias: new FormControl(null),
    tagIds: new FormControl([])
  });

  constructor(
    public tagService: TagService,
    private stickerPackService: StickerPackService,
    private messageService: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tagService.refreshTags();
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

  private assertStickerPackWithNameExists(control: AbstractControl): Observable<null | { stickerPackDoesNotExist: true }> {
    return this.stickerPackService.isStickerPackExists$(control.value ?? '')
      .pipe(
        map(isExists => isExists ? null : { stickerPackDoesNotExist: true })
      );
  }
}
