import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  { path: '', component: UserComponent,
  },
  { path: 'categorias', component: CategoryComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
