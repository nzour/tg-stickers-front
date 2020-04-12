import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { OnlyAdminGuard } from './admin/guards/only-admin.guard';
import { MainComponent } from './components/main/main.component';
import { ValidateAdminTokenGuard } from './admin/guards/validate-admin-token.guard';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ValidateAdminTokenGuard],
    canActivateChild: [ValidateAdminTokenGuard],
  },
  {
    path: 'admin',
    loadChildren: () => AdminModule,
    canActivate: [OnlyAdminGuard],
    canActivateChild: [OnlyAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
