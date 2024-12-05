import { NgModule } from '@angular/core';
import { TransactionsComponent } from './transaction.component';
import { TransactionsRoutingModule } from './transaction-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    SharedModule,
    TransactionsRoutingModule,
    FormsModule,
    MatButtonToggleModule,
    TooltipModule.forRoot(),

    

  ]
})
export class TransactionsModule { }
