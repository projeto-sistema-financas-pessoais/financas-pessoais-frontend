import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { CategoryComponent } from './category/category.component';



@NgModule({
  declarations: [
    UserComponent,
    CategoryComponent
  ],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
