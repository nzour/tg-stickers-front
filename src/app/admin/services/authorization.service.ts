import { Observable } from 'rxjs';
import { AdminTokenOutput } from './admin-token.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  logIn(input: LogInInput): Observable<AdminTokenOutput> {
    return this.http.post<AdminTokenOutput>('auth/login', input);
  }

  isLoginBusy(): Observable<boolean> {
    return this.http
      .head<void>('auth/login-busy')
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
