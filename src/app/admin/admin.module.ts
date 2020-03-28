import { NgModule } from '@angular/core';
import { AuthorizationService } from './services/authorization.service';
import { OnlyAdminGuard } from './guards/only-admin.guard';
import { CreateTagComponent } from './components/create-tag/create-tag.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [CreateTagComponent],
  imports: [
    AdminRoutingModule,
    SharedModule
  ],
  providers: [
    AuthorizationService,
    OnlyAdminGuard
  ]
})
export class AdminModule {
}
