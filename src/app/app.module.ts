import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { NzAvatarModule, NzButtonModule, NzFormModule, NzGridModule, NzListModule, NzRadioModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

const nzModules = [
  NzGridModule,
  NzListModule,
  NzButtonModule,
  NzFormModule,
  NzRadioModule,
  NzAvatarModule
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    ...nzModules
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function RootInjectable() {
  return Injectable({ providedIn: 'root' });
}
