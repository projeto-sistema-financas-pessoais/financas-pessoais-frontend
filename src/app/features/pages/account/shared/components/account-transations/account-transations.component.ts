import { Component, Injector } from '@angular/core';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';
import { TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';

@Component({
  selector: 'app-account-transations',
  templateUrl: './account-transations.component.html',
  styleUrls: ['./account-transations.component.scss']
})
export class AccountTransationsComponent extends BaseGetIdComponent<Account> {

  valueConsolidatedIncome!: number;
  valueConsolidatedExpense!: number;
  valueTotalStatementConsolidated!: number

  valueTotalExpense!: number;
  valueTotalIncome!: number;
  valueTotalTransferReceived!: number;
  valueTotalTransferSend!: number;
  
  dateMonth!: string;
  month = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  constructor
  (  injector : Injector,
    protected accountService: AccountService
  ){
    super(injector, new Account({}), accountService);
  }

   
  addStatement(evt: TransactionList | undefined){
    
    if(evt){
      const datePayment = new Date(evt.data_pagamento);

      const [year, month, ] = String(evt.data_pagamento).split('-').map(Number);
      this.dateMonth = this.month[month -1] + " " + year
      this.itemStatement = evt;

  
    }else{
      this.itemStatement = undefined;

    }
  
  }


}



