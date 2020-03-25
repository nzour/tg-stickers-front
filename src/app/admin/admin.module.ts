import { NgModule } from '@angular/core';
import { AdminTokenInterceptor } from './interceptors/admin-token.interceptor';
import { AdminTokenService } from './services/admin-token.service';
import { AuthorizationService } from './services/authorization.service';
import { OnlyAdminGuard } from './guards/only-admin.guard';
import { CreateTagComponent } from './components/create-tag/create-tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TagService } from './services/tag.service';
import { HostUrlInterceptor } from '../utils/interceptors/host-url.interceptor';


const services = [
  AdminTokenService,
  AuthorizationService,
  TagService
];

const modules = [
  ReactiveFormsModule,
  FormsModule,
  NgZorroAntdModule,
  CommonModule,
  HttpClientModule,
  RouterModule
];

@NgModule({
  declarations: [CreateTagComponent],
  imports: [
    AdminRoutingModule,
    ...modules
  ],
  exports: [
    ...modules
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HostUrlInterceptor,
      multi: true
    },
    ...services,
    OnlyAdminGuard
  ]
})
export class AdminModule {
}
