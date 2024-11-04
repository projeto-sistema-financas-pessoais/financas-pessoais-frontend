import { NgModule } from '@angular/core';
import { TransactionsComponent } from './transaction.component';
import { TransactionsRoutingModule } from './transaction-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    SharedModule,
    TransactionsRoutingModule,
    FormsModule,
    MatButtonToggleModule
    

  ]
})
export class TransactionsModule { }
