import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './api-interceptor';
import { AdminTokenService } from './services/admin-token.service';
import { TagService } from './services/tag.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { StickerPackService } from './services/sticker-pack.service';
import { IfAdminDirective } from './utilities/if-admin.directive';
import { LoadFilePipe } from './utilities/load-file.pipe';
import { FormatDatePipe } from './utilities/format-date.pipe';


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
  declarations: [IfAdminDirective, LoadFilePipe, FormatDatePipe],
  imports: modules,
  exports: [
    modules,
    IfAdminDirective,
    LoadFilePipe,
    FormatDatePipe
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
