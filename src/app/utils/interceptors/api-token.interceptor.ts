import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminTokenService } from '../services/admin-token.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiTokenInterceptor implements HttpInterceptor {

  constructor(private adminTokenService: AdminTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const adminTokenInfo = this.adminTokenService.getToken();

    request = request.clone({
      url: `${environment.apiUrl}/${request.url}`
    });

    if (adminTokenInfo && adminTokenInfo.accessToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${adminTokenInfo.accessToken}` }
      });
    }

    return next.handle(request);
  }
}
