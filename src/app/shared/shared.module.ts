import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './api-interceptor';
import { AdminTokenService } from './services/admin-token.service';
import { TagService } from './services/tag.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { IfAdminDirective } from './directives/if-admin.directive';
import { StickerPackService } from './services/sticker-pack.service';


const services = [
  AdminTokenService,
  TagService,
  StickerPackService
];

const modules = [
  ReactiveFormsModule,
  FormsModule,
  NgZorroAntdModule,
  CommonModule,
  HttpClientModule,
  RouterModule,
  CommonModule
];

@NgModule({
  declarations: [IfAdminDirective],
  imports: modules,
  exports: [
    modules,
    IfAdminDirective
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    ...services
  ]
})
export class SharedModule {
}
