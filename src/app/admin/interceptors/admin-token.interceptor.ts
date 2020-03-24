import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminTokenService } from '../services/admin-token.service';

@Injectable()
export class AdminTokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: AdminTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const adminTokenInfo = this.tokenService.getToken();

    if (adminTokenInfo && adminTokenInfo.accessToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${adminTokenInfo.accessToken}` }
      });
    }

    return next.handle(request);
  }
}
