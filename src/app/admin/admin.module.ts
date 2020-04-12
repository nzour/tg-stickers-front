import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { CreateStickerPackComponent } from './components/create-sticker-pack/create-sticker-pack.component';
import { CreateTagComponent } from './components/create-tag/create-tag.component';
import { OnlyAdminGuard } from './guards/only-admin.guard';
import { AuthorizationService } from './services/authorization.service';
import { ValidateAdminTokenGuard } from './guards/validate-admin-token.guard';


@NgModule({
  declarations: [
    CreateTagComponent,
    CreateStickerPackComponent
  ],
  imports: [
    AdminRoutingModule,
    SharedModule
  ],
  providers: [
    AuthorizationService,
    OnlyAdminGuard,
    ValidateAdminTokenGuard
  ]
})
export class AdminModule {
}
