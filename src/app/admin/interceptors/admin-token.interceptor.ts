import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminTokenService } from '../services/admin-token.service';
import { filter } from 'rxjs/operators';

@Injectable()
export class AdminTokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: AdminTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.tokenService
      .getToken$()
      .pipe(
        filter(token => !!token)
      )
      .subscribe(token => {
        if (token && token.accessToken) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token.accessToken}` }
          });
        }
      });

    return next.handle(request);
  }
}
