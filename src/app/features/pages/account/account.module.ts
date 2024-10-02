import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    SharedModule,
    AccountRoutingModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
