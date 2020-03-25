import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTagComponent } from './components/create-tag/create-tag.component';


const routes: Routes = [
  {
    path: 'tags',
    component: CreateTagComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
