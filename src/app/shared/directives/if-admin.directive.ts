import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AdminTokenService } from '../services/admin-token.service';

@Directive({ selector: '[appIfAdmin]' })
export class IfAdminDirective implements OnInit {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenService: AdminTokenService
  ) { }

  ngOnInit(): void {
    this.tokenService.hasToken$()
      .subscribe(hasToken => {
        hasToken
          ? this.viewContainer.createEmbeddedView(this.templateRef)
          : this.viewContainer.clear();
      });
  }
}
