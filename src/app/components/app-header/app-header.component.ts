import { Component } from '@angular/core';
import { AdminTokenService } from '../../admin/services/admin-token.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {

  showLoginForm = false;

  constructor(public tokenService: AdminTokenService) { }

  logout(): void {
    this.showLoginForm = false;
    this.tokenService.eraseToken();
  }
}
