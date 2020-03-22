import { RootInjectable } from '../../app.module';
import { Observable } from 'rxjs';
import { AdminTokenOutput } from './admin-token.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@RootInjectable()
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  logIn(): Observable<AdminTokenOutput> {
    return this.http.get<AdminTokenOutput>('login');
  }

  isLoginBusy(): Observable<boolean> {
    return this.http
      .head<void>('login-busy')
      .pipe(
        map(() => true)
      );
  }
}

export interface LogInInput {
  login: string;
  password: string;
}

export type RegisterInput = LogInInput & { name: string };
