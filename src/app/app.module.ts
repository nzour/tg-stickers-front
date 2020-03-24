import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { HostUrlInterceptor } from './utils/interceptors/host-url.interceptor';
import { LogInFormComponent } from './components/log-in-form/log-in-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AppHeaderComponent,
    LogInFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    AdminModule,
    ReactiveFormsModule,
    NgZorroAntdModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HostUrlInterceptor,
      multi: true
    }
  ]
})
export class AppModule {
}

export function RootInjectable() {
  return Injectable({ providedIn: 'root' });
}
