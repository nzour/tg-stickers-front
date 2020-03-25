import { Component } from '@angular/core';
import { TagService as AdminTagService } from '../../services/tag.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss']
})
export class CreateTagComponent {

  loading = false;

  tagForm = new FormGroup({
    name: new FormControl(null, [Validators.required])
  });

  constructor(
    private tagService: AdminTagService,
    private nzMessageService: NzMessageService,
    private router: Router
  ) { }

  submit(): void {
    if (!this.tagForm.valid || this.loading) {
      return;
    }

    this.loading = true;

    const { name } = this.tagForm.value;

    // todo: переделать проверку уникальности названия на асинхронную валидацию
    this.tagService
      .isTagNameBusy(name)
      .pipe(
        map(() => false),
        catchError(() => {
          this.createTag(name);
          return of(true);
        })
      )
      .subscribe(result => {
        if (!result) {
          this.nzMessageService.create('error', 'Название занято.');
        }
      });
  }

  private createTag(name: string): void {
    this.tagService.createTag(name)
      .pipe(
        catchError(err => {
          this.nzMessageService.create('error', 'Название занято.');
          throw err;
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(async () => await this.router.navigate(['/']));
  }
}
