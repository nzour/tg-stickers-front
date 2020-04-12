import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminTokenService } from '../../shared/services/admin-token.service';
import * as moment from 'moment';
import { Timestamp } from '../../shared/types';

@Injectable({
  providedIn: 'root'
})
export class ValidateAdminTokenGuard implements CanActivate, CanActivateChild {

  constructor(private tokenService: AdminTokenService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isTokenExpired()) {
      this.tokenService.eraseToken();
    }

    return true;
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }

  private isTokenExpired(): boolean {
    const tokenInfo = this.tokenService.getToken();

    if (!tokenInfo) {
      return false;
    }

    const tokenPayload = JSON.parse(atob(tokenInfo.accessToken.split('.')[1]));

    if (!ValidateAdminTokenGuard.hasExpiration(tokenPayload)) {
      return false;
    }

    return moment().isAfter(moment.unix(tokenPayload.exp));
  }

  private static hasExpiration(object: any): object is { exp: Timestamp } {
    return 'exp' in object;
  }

}
