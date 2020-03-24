import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminTokenInterceptor } from './interceptors/admin-token.interceptor';
import { AdminTokenService } from './services/admin-token.service';
import { AuthorizationService } from './services/authorization.service';
import { OnlyAdminGuard } from './guards/only-admin.guard';


const services = [
  AdminTokenService,
  AuthorizationService
];

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminTokenInterceptor,
      multi: true
    },
    ...services,
    OnlyAdminGuard
  ]
})
export class AdminModule { }
