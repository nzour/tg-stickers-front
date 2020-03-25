import { Guid } from '../../utils/types';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const ADMIN_TOKEN_KEY = 'ADMIN_TOKEN';

const tokenSubject$ = new BehaviorSubject<null | AdminTokenOutput>(null);

@Injectable()
export class AdminTokenService {
  store(tokenInfo: AdminTokenOutput): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, JSON.stringify(tokenInfo));
    tokenSubject$.next(tokenInfo);
  }

  getToken(): Observable<AdminTokenOutput | null> {
    return tokenSubject$.asObservable();
  }

  hasToken(): Observable<boolean> {
    return tokenSubject$.pipe(map(token => !!token));
  }

  eraseToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    tokenSubject$.next(null);
  }
}

export interface AdminTokenOutput {
  adminId: Guid;
  name: string;
  login: string;
  accessToken: string;
}
