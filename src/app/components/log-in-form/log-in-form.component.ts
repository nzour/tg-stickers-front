import { Component } from '@angular/core';
import { AdminTokenService } from '../../admin/services/admin-token.service';
import { AuthorizationService } from '../../admin/services/authorization.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent {

  loading = false;

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private tokenService: AdminTokenService,
    private authorizationService: AuthorizationService,
    private messageService: NzMessageService
  ) { }

  submit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.loading = true;

    this.authorizationService
      .logIn(this.loginForm.value)
      .pipe(
        finalize(() => this.loading = false),
        catchError((err: any) => {
          this.messageService.create('error', 'Неверно введены логин или пароль');
          throw err;
        })
      )
      .subscribe(this.tokenService.store);
  }
}
