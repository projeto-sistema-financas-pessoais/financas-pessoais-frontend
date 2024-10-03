import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCardComponent } from './credit-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditCardRoutingModule } from './credit-card-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CreditCardComponent
  ],
  imports: [
    SharedModule,
    CreditCardRoutingModule,
    ReactiveFormsModule
  ]
})
export class CreditCardModule { }
