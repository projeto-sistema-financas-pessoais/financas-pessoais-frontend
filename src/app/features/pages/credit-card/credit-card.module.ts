import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCardComponent } from './credit-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditCardRoutingModule } from './credit-card-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditCardStatementComponent } from './shared/components/credit-card-statement/credit-card-statement.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';



@NgModule({
  declarations: [
    CreditCardComponent,
    CreditCardStatementComponent
  ],
  imports: [
    SharedModule,
    CreditCardRoutingModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
  ]
})
export class CreditCardModule { }
