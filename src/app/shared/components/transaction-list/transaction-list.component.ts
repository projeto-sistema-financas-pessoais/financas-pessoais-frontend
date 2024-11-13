import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from 'src/app/shared/models/enum.model';
import { TransationFilter, TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';
import { TransationService } from 'src/app/features/pages/transaction/shared/services/transation.service';
import { Category } from 'src/app/features/pages/user/shared/models/category.model';
import { ModalComponent } from '../modal/modal.component';
import { ModalConfig } from '../../models/moda-config.model';
import { AlertModalService } from '../../services/alert-modal.service';
import { TransationConsolidated } from 'src/app/features/pages/transaction/shared/models/transation.model';
import { CategoryService } from 'src/app/features/pages/user/shared/services/category.service';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  protected ngUnsubscribe = new Subject<void>();

  @Input() type: 'transation' | 'member' | 'account' | 'credit' = 'transation'
  @Input() id_type?: number;
  @Output() itemStatement: EventEmitter<TransactionList | undefined> = new EventEmitter;
  

  // !== transatiotn
  @Output() valueTotalExpense: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueConsolidatedExpense: EventEmitter<number> = new EventEmitter<number>();


  // member and account
  @Output() valueTotalIncome: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueConsolidatedIncome: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueTotalTransferReceived: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueTotalTransferSend: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueTotalStatementConsolidated: EventEmitter<number> = new EventEmitter<number>();


  // credit
  @Output() valueTotalConfirmed: EventEmitter<number> = new EventEmitter<number>();


  //member 
  @Output() valuetotalMemberExpense: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueTotalTotalConsolidatedMemberExpense: EventEmitter<number> = new EventEmitter<number>();


  @ViewChild('modal_small') protected modalSmall!: ModalComponent;
  modalConfig! : ModalConfig;

  deleteItem!: TransactionList;
  openModalDelete: boolean = false;

  canOpenFilter: boolean = false;

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

  enumMovimentacao!: typeof TipoMovimentacao
  enumFormaPagamento!: typeof FormaPagamento
  enumCondicaoPagamento!: typeof CondicaoPagamento
  Object = Object;

  transactionList: TransactionList[] = [];
  transationFilter!: TransationFilter;

  category!: Category[]

  nameUser!: string
 


  constructor(
    private readonly transationService: TransationService,
    private readonly categoryService: CategoryService,
    private readonly alertService: AlertModalService,
    private readonly authService: AuthService){

    this.enumMovimentacao = TipoMovimentacao;
    this.enumFormaPagamento = FormaPagamento;
    this.enumCondicaoPagamento = CondicaoPagamento;


    this.transationFilter = new TransationFilter()
    this.transationFilter.ano = new Date().getFullYear();
    this.transationFilter.mes = new Date().getMonth() + 1;
    
  }

  ngOnInit(): void {
    this.nameUser = this.authService.GetUser().name || 'null'

    if(this.id_type){
      if(this.type == 'member'){
        this.transationFilter.id_parente = this.id_type
      }
      else if (this.type == 'account'){
        this.transationFilter.id_conta = this.id_type
      }
      else if (this.type == 'credit'){
        this.transationFilter.id_cartao_credito = this.id_type
      }else {
        this.getCategory();

      }
    }else{
      this.getCategory();

    }

    this.chargeList();

   
  }
  
  protected chargeList(){
    this.transationService.getAllByFilter(this.transationFilter)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: TransactionList[]) => {
          this.transactionList = data;
          this.sendOutput()

          console.log(this.transactionList)
      }, 
      error: (error: HttpErrorResponse) => {
        
        if(error.status == 404){
          this.transactionList = []
        }
        console.error("error to get list of transations", error)
      }
    })
  }

  sendOutput(){

    // credit 

    let sumTotalConfirmed: number = 0;
    let sumStatementConsolidated: number = 0;
    

    // member and account
    let sumTotalIncome: number = 0;
    let sumTotalExpense: number = 0;
    let sumTotalTransferReceived: number = 0;
    let sumTotalTransferSend: number = 0;
    let sumTotalConsolidatedExpense: number = 0;
    let sumTotalConsolidatedIncome: number = 0;

   

    // member
    let sumTotalMemberExpense: number = 0
    let sumTotalMemberConsolidatedExpense: number = 0;

    this.transactionList.forEach(item => {

      
      // sumTotal += Number(item.valor);

      if(item.tipoMovimentacao == this.enumMovimentacao.RECEITA){
        sumTotalIncome += Number(item.valor)
        if(item.consolidado){
          sumTotalConsolidatedIncome += Number(item.valor)
        }
      }else if(item.tipoMovimentacao == this.enumMovimentacao.DESPESA){
        sumTotalExpense += Number(item.valor)
        if(item.consolidado){
          sumTotalConsolidatedExpense += Number(item.valor)
        }
      }
      else if (item.tipoMovimentacao == this.enumMovimentacao.TRANSFERENCIA){
        if(item.id_conta == this.transationFilter.id_conta){
          sumTotalTransferSend += Number(item.valor)
        }
        else{
          sumTotalTransferReceived += Number(item.valor)

        }
      }
      else if (item.tipoMovimentacao == this.enumMovimentacao.FATURA){
        if(item.consolidado){
          sumStatementConsolidated += Number(item.valor)
        }
        
      }


      // if (item.consolidado) {

      //   sumConsolidated +=  Number(item.valor);
      // }
      if(item.participa_limite_fatura_gastos){
        sumTotalConfirmed +=  Number(item.valor);

      }

      if(this.type == 'member'){
        const member =  item.divide_parente.find(item => item.id_parente == this.transationFilter.id_parente)
        if(item.tipoMovimentacao == this.enumMovimentacao.DESPESA){
          sumTotalMemberExpense += Number(member?.valor_parente) || 0;

          if(item.consolidado){
            sumTotalMemberConsolidatedExpense += Number(member?.valor_parente) || 0;
          }
        }
          
      }
      
    });
    

    if(this.type !== 'transation'){  // credit, account or member
      this.itemStatement.emit(this.transactionList[0] || undefined)
      this.valueTotalExpense.emit(Number(sumTotalExpense));
      this.valueConsolidatedExpense.emit(sumTotalConsolidatedExpense)
      this.valueTotalStatementConsolidated.emit(sumStatementConsolidated)
    }
    

    if(this.type== 'member' || this.type == 'account'){
      this.valueConsolidatedIncome.emit(sumTotalConsolidatedIncome)
      this.valueTotalIncome.emit(sumTotalIncome);
      this.valueTotalTransferReceived.emit(sumTotalTransferReceived);
      this.valueTotalTransferSend.emit(sumTotalTransferSend);

    }

    if(this.type == 'credit'){
      // this.valuetotal.emit(sumTotal);
      // this.valueConsolidated.emit(sumConsolidated);
      this.valueTotalConfirmed.emit(sumTotalConfirmed)


      
    }else if(this.type == 'member'){
      
      this.valueTotalTotalConsolidatedMemberExpense.emit(sumTotalMemberConsolidatedExpense)
      this.valuetotalMemberExpense.emit(sumTotalMemberExpense);

    }
  }


  private getCategory(){
    console.log("teste category", this.category)
    this.categoryService.getAll(false)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Category[]) => {
        this.category = data;
        console.log("category", this.category)
      },
      error: (error: HttpErrorResponse) =>{
        console.log("error get category", error)
      }
    })
  }


  divideMember(item: TransactionList): boolean {
    return item.divide_parente.length > 1 || 
           (item.divide_parente.length === 1 && item.divide_parente[0].nome_parente !== this.nameUser);
  }
  

  protected openFilter(){
    this.canOpenFilter = !this.canOpenFilter
  }


  changeMonth(plus: boolean){


    if (plus){
      if(this.transationFilter.mes == 12){
        this.transationFilter.mes = 1;
        this.transationFilter.ano += 1;
      }else{
        this.transationFilter.mes += 1;
      }
    }
    else{
      if(this.transationFilter.mes == 1){
        this.transationFilter.mes = 12;
        this.transationFilter.ano -= 1;
      }else{
        this.transationFilter.mes -= 1;
      }
    }

    this.chargeList();
  }

  protected openDelete(item: TransactionList){

    this.openModalDelete = true;

    this.deleteItem = item;
    this.modalConfig = {
      modalTitle: 'Excluir movimentação'
    }

    this.modalSmall.openSmall();
  }

  deleteTransation(){
    this.transationService.deleteTransation(this.deleteItem.id_movimentacao)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: any) =>{

        this.alertService.showAlertSuccess("Sucesso ao deletar!")

        setTimeout(() =>{
          window.location.reload();
        }, 1000)
        
        console.log("delete transation success", data)
      },
      error: (error: HttpErrorResponse) =>{
        console.log('error delete transation', error)
      }
    })
  }

  changeConsolidated(item: TransactionList){

    item.consolidado = !item.consolidado;

    let consolidated: TransationConsolidated = {
      id_movimentacao: item.id_movimentacao,
      consolidado: item.consolidado
    }
    this.transationService.consolidatedTransation(consolidated)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: any) =>{

        this.alertService.showAlertSuccess(
          item.consolidado ? 'Sucesso ao consolidar movimentação!' : 'Sucesso ao não consolidar movimentação!'
         
        )

        if(this.type == 'account'  || this.type == 'member'){
          setTimeout(() =>{
            window.location.reload();
          }, 1000)
        }
        
        console.log("delete transation success", data)
      },
      error: (error: HttpErrorResponse) =>{
        console.log('error delete transation', error)
      }
    })
  }

  changeLimitAndExchange(item: TransactionList){

    item.participa_limite_fatura_gastos = !item.participa_limite_fatura_gastos;

    this.transationService.changeLimitAndExpense(item.id_movimentacao, item.participa_limite_fatura_gastos)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: any) =>{

        this.alertService.showAlertSuccess(
          item.participa_limite_fatura_gastos ? 'Sucesso ao contalizar no limite e gastos da fatura!' : 'Sucesso ao retirar do  limite e gastos da fatura!'
        )
        if(this.type == 'credit'){
          setTimeout(() =>{
            window.location.reload();
          }, 1000)
        }
        
        console.log("delete transation success", data)
      },
      error: (error: HttpErrorResponse) =>{
        console.log('error delete transation', error)
      }
    })
  }
}
