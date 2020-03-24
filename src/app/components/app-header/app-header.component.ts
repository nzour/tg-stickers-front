import { Component } from '@angular/core';
import { AdminTokenService } from '../../admin/services/admin-token.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {

  showLoginForm = false;

  constructor(private tokenService: AdminTokenService) { }

  isAuthorized(): boolean {
    return !!this.tokenService.getToken();
  }

  logout(): void {
    this.tokenService.eraseToken();
    location.reload(); // todo: Заменить на обзерверы.
  }
}
