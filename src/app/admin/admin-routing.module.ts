import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTagComponent } from './components/create-tag/create-tag.component';
import { CreateStickerPackComponent } from './components/create-sticker-pack/create-sticker-pack.component';


const routes: Routes = [
  {
    path: 'tags',
    component: CreateTagComponent
  },
  {
    path: 'stickers',
    component: CreateStickerPackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
