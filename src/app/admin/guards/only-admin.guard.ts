import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { AdminTokenService } from '../services/admin-token.service';

@Injectable()
export class OnlyAdminGuard implements CanActivate, CanActivateChild {

  constructor(private tokenService: AdminTokenService) { }

  canActivate(): boolean {
    return !!this.tokenService.getToken();
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

}
