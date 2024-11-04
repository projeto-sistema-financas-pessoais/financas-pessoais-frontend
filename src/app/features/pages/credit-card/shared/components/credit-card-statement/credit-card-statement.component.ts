import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CreditCard, StatementSend } from '../../models/credit-card.model';
import { CreditCardService } from '../../services/credit-card.service';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';
import { TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';
import { takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { Account } from 'src/app/features/pages/account/shared/models/account.model';
import { AccountService } from 'src/app/features/pages/account/shared/services/account.service';
import { AlertModalService } from '../../../../../../shared/services/alert-modal.service';

@Component({
  selector: 'app-credit-card-statement',
  templateUrl: './credit-card-statement.component.html',
  styleUrls: ['./credit-card-statement.component.scss']
})
export class CreditCardStatementComponent extends BaseGetIdComponent<CreditCard>{

  // modals
  @ViewChild('modal_small') protected modalSmall!: ModalComponent;
  modalConfig! : ModalConfig;
  openModalCloseStatement: boolean = false;
  dropdownOpenAccountCurrent: boolean = false;
  selectedAccontCurrentName: string | null = null;
  selectedAccontCurrentIcon: string | null = null;
  account: Account [] = [];


  // general
  itemStatement!: TransactionList | undefined;
  statementSend!: StatementSend;
  dateMonth!: string;
  dateFechamento!: Date;
  datePayment!: Date;
  dateToday!: Date;

  valueConsolidated!: number
  valueTotal!: number;
  valueTotalConfirmed!: number

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

  constructor(  injector : Injector,
    private readonly accountService: AccountService,
    private alertService: AlertModalService,
    private creditCardService: CreditCardService){
    super(injector, new CreditCard({}), creditCardService );
    this.dateToday = new Date()
    this.statementSend = new StatementSend()
  }

  
  addStatement(evt: TransactionList | undefined){
    
    if(evt){
      this.datePayment = new Date(evt.data_pagamento);
    
      const month = this.datePayment.getMonth();
      const year = this.datePayment.getFullYear();
  
      this.dateMonth = this.month[month] + " " + year
      this.itemStatement = evt;
  
      this.dateFechamento =  new Date(this.itemStatement.fatura_info?.data_fechamento || '')
      console.log("itemStatement", this.itemStatement, this.valueTotal,  "teste",this.valueConsolidated)
  
  
    }else {
      this.itemStatement = evt;

    }
  
  }

  isButtonDisabled(): boolean {
    return (this.dateToday.getMonth() < this.datePayment.getMonth()) || 
           (this.dateToday.getFullYear() < this.datePayment.getFullYear());
  }


  closeCardStatement(){
    this.statementSend.id_fatura = this.itemStatement?.id_fatura || 0

    this.creditCardService.closeStatement(this.statementSend)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data) =>{
        this.alertService.showAlertSuccess(
          this.datePayment < this.dateToday || (this.dateToday.getMonth() !== this.datePayment.getMonth()) ? 'Sucesso ao antecipar fatura' : 'Sucesso ao fechar fatura'
        )

        setTimeout(() =>{
          window.location.reload();
        }, 1000)
        
      },
      error: (error: HttpErrorResponse) =>{
        console.error(error)
      }
    })
  }


  

  // modal  functions 

  async openCloseCardStatement(){
    this.openModalCloseStatement = true;
    this.modalConfig = {
      modalTitle: this.datePayment < this.dateToday || (this.dateToday.getMonth() !== this.datePayment.getMonth()) ? 'Antecipar pagamento' : 'Fechar fatura'
    }

    if(this.account.length == 0)
    this.getAccount();


    await this.modalSmall.openSmall()
  }



  getAccount(){
    this.accountService.getAll(true)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Account[]) =>{
        
        this.account = data;
      }, 
      error:(error: HttpErrorResponse) => {
        console.log(error)
      }
    })
  }

  toggleDropdownAccountCurrent(){
    this.dropdownOpenAccountCurrent= !this.dropdownOpenAccountCurrent;

  }


  selectAccountCurrent(resource: Account){
    this.selectedAccontCurrentName = resource.nome;
    this.selectedAccontCurrentIcon = resource.nome_icone;
    this.statementSend.id_conta = resource.id_conta
    this.dropdownOpenAccountCurrent = false;
  }
}


