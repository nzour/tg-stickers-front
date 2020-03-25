import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { AdminTokenService } from '../services/admin-token.service';
import { Observable } from 'rxjs';

@Injectable()
export class OnlyAdminGuard implements CanActivate, CanActivateChild {

  constructor(private tokenService: AdminTokenService) { }

  canActivate(): Observable<boolean> | boolean {
    return this.tokenService.hasToken$();
  }

  canActivateChild(): Observable<boolean> | boolean {
    return this.canActivate();
  }

}
