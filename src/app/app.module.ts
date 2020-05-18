import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AdminModule } from './admin/admin.module';
import { LogInFormComponent } from './components/log-in-form/log-in-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MainComponent } from './components/main/main.component';
import { TagsPageComponent } from './components/tags-page/tags-page.component';
import { StickerPacksPageComponent } from './components/sticker-packs-page/sticker-packs-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StickerPackSinglePageComponent } from './components/sticker-pack-single-page/sticker-pack-single-page.component';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AppHeaderComponent,
    LogInFormComponent,
    MainComponent,
    TagsPageComponent,
    StickerPacksPageComponent,
    StickerPackSinglePageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdminModule,
    SharedModule,
    FontAwesomeModule
  ]
})
export class AppModule {
}
