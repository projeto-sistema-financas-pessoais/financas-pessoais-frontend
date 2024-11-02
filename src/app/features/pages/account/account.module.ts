import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountTransationsComponent } from './shared/components/account-transations/account-transations.component';



@NgModule({
  declarations: [
    AccountComponent,
    AccountTransationsComponent
  ],
  imports: [
    SharedModule,
    AccountRoutingModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
