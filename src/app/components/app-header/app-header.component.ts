import { Component } from '@angular/core';
import { AdminTokenService } from '../../shared/services/admin-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {

  showLoginForm = false;

  constructor(public tokenService: AdminTokenService, private router: Router) { }

  async logout(): Promise<void> {
    this.showLoginForm = false;
    this.tokenService.eraseToken();
    await this.router.navigate(['/']);
  }
}
