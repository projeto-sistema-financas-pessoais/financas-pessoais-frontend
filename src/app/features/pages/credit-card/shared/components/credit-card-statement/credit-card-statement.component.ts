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
  // dateFechamento!: Date;
  // datePayment!: Date;
  dateToday!: string;

  valueConsolidatedExpense!: number
  valueTotalExpense!: number;
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
    this.dateToday= this.formatDateToday(); 

    this.statementSend = new StatementSend()
  }

  formatDateToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  addStatement(evt: TransactionList | undefined){
    
    if(evt){


      const [year, month, day] = String(evt.fatura_info?.data_fechamento).split('-').map(Number);

      this.dateMonth = this.month[month-1] + " " + year

      this.itemStatement = evt;


    }
    else{
      this.itemStatement  = undefined;
    }

  }

  checkIfDateIsLess(date1: any, date2: any, value?: boolean){

    const [year1, month1, day1] = String(date1).split('-').map(Number);

    const [year2, month2, day2] = String(date2).split('-').map(Number);

      let isDate1Less = false;

      if (year1 < year2) {
        isDate1Less = true;
      } else if (year1 === year2) {
          if (month1 < month2) {
            isDate1Less = true;
          } else if (month1 === month2) {
              if (day1 < day2) {
                isDate1Less = true;
              }
          }
      }


    return isDate1Less

  }

  checkMonth(date1: any, date2: any){
    const [year1, month1, day1] = String(date1).split('-').map(Number);

    const [year2, month2, day2] = String(date2).split('-').map(Number);

    if(month1 !== month2){
      return true
    }

    return false
  }


  checkMothYear(date1: any, date2: any){
    const [year1, month1, day1] = String(date1).split('-').map(Number);

    const [year2, month2, day2] = String(date2).split('-').map(Number);


    if (year2 === year1) {
      // Mesmo ano: verificar a diferença de meses
      return (month2 - month1) >= 2;
    } else if (year2 > year1) {
        const monthDifference = (year2 - year1) * 12 + (month2 - month1);
        return monthDifference >= 2;
    }
    
    // Qualquer outro caso (data2 é menor que data1 ou muito próximo)
    return false;

  }

  isButtonDisabled(): boolean {
    return this.checkMothYear(this.dateToday, this.itemStatement?.fatura_info?.data_fechamento)

  }


  closeCardStatement(){
    this.statementSend.id_fatura = this.itemStatement?.id_fatura || 0

    this.creditCardService.closeStatement(this.statementSend)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data) =>{
        this.alertService.showAlertSuccess(

          this.checkIfDateIsLess(this.dateToday ,this.itemStatement?.fatura_info?.data_fechamento) ? 'Sucesso ao antecipar fatura' : 'Sucesso ao fechar fatura'
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
      modalTitle: 
      this.checkIfDateIsLess(this.dateToday ,this.itemStatement?.fatura_info?.data_fechamento)
       ? 'Antecipar pagamento' : 'Fechar fatura'
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


