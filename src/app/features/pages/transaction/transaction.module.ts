import { NgModule } from '@angular/core';
import { TransactionsComponent } from './transaction.component';
import { TransactionsRoutingModule } from './transaction-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    SharedModule,
    TransactionsRoutingModule,
    TooltipModule.forRoot(),

  ]
})
export class TransactionsModule { }
