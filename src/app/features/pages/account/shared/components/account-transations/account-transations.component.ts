import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { Subject, takeUntil } from 'rxjs';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';
import { TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';

@Component({
  selector: 'app-account-transations',
  templateUrl: './account-transations.component.html',
  styleUrls: ['./account-transations.component.scss']
})
export class AccountTransationsComponent extends BaseGetIdComponent<Account>{

  valueConsolidatedIncome!: number;
  valueConsolidatedExpense!: number;

  valueTotalExpense!: number;
  valueTotalIncome!: number;
  
  
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
    private accountService: AccountService
  ){
    super(injector, new Account({}), accountService);
  }

   
  addStatement(evt: TransactionList | undefined){
    
    if(evt){
      const datePayment = new Date(evt.data_pagamento);
    
      const month = datePayment.getMonth();
      const year = datePayment.getFullYear();
  
      this.dateMonth = this.month[month] + " " + year
  
    }
  
  }


}



