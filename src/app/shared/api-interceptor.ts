import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminTokenService } from './services/admin-token.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private tokenService: AdminTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      url: `${environment.apiUrl}/${request.url}`,
      setHeaders: { Authorization: `Bearer ${this.tokenService.getToken()?.accessToken}` }
    });

    return next.handle(request)
      .pipe(
        catchError(httpError => {
          'status' in httpError && httpError.status === 401 && this.tokenService.eraseToken();

          throw httpError;
        })
      );
  }
}
