import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from 'src/app/shared/models/enum.model';
import { TransationFilter, TransationList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';
import { TransationService } from 'src/app/features/pages/transaction/shared/services/transation.service';
import { Category } from 'src/app/features/pages/user/shared/models/category.model';
import { ModalComponent } from '../modal/modal.component';
import { ModalConfig } from '../../models/moda-config.model';
import { AlertModalService } from '../../services/alert-modal.service';
import { TransationConsolidated } from 'src/app/features/pages/transaction/shared/models/transation.model';
import { CategoryService } from 'src/app/features/pages/user/shared/services/category.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  protected ngUnsubscribe = new Subject<void>();

  @Input() type: 'transation' | 'member' | 'account' | 'credit' = 'transation'
  @Input() id_type?: number;

  @ViewChild('modal_small') protected modalSmall!: ModalComponent;
  modalConfig! : ModalConfig;

  deleteItem!: TransationList;
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

  transationList: TransationList[] = [];
  transationFilter!: TransationFilter;

  category!: Category[]

 


  constructor(
    private readonly transationService: TransationService,
    private readonly categoryService: CategoryService,
    private readonly alertService: AlertModalService){

    this.enumMovimentacao = TipoMovimentacao;
    this.enumFormaPagamento = FormaPagamento;
    this.enumCondicaoPagamento = CondicaoPagamento;


    this.transationFilter = new TransationFilter()
    this.transationFilter.ano = new Date().getFullYear();
    this.transationFilter.mes = new Date().getMonth() + 1;
  }

  ngOnInit(): void {

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
    }

    this.chargeList();

   
  }
  
  protected chargeList(){
    this.transationService.getAllByFilter(this.transationFilter)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: TransationList[]) => {
          this.transationList = data;
          console.log(this.transationList)
      }, 
      error: (error: HttpErrorResponse) => {
        
        if(error.status == 404){
          this.transationList = []
        }
        console.error("error to get list of transations", error)
      }
    })
  }

  private getCategory(){
    this.categoryService.getAll(false)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Category[]) => {
        this.category = data;
      },
      error: (error: HttpErrorResponse) =>{

      }
    })
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

  protected openDelete(item: TransationList){

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

  changeConsolidated(item: TransationList){

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

        
        console.log("delete transation success", data)
      },
      error: (error: HttpErrorResponse) =>{
        console.log('error delete transation', error)
      }
    })
  }
}
