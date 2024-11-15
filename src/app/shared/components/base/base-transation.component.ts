import { Directive, Injector, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { BaseModel } from "../../models/base/base-model.model";
import { BaseFormService } from "../../services/base/base-form.service";
import { ActivatedRoute } from "@angular/router";
import { TransationService } from "src/app/features/pages/transaction/shared/services/transation.service";
import { AlertModalService } from "../../services/alert-modal.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TransactionList } from "src/app/features/pages/transaction/shared/models/transation-list.model";
import { TransationConsolidated } from "src/app/features/pages/transaction/shared/models/transation.model";
import { TipoMovimentacao, FormaPagamento, CondicaoPagamento } from "../../models/enum.model";
import { ModalConfig } from "../../models/moda-config.model";
import { ModalComponent } from "../modal/modal.component";

@Directive()
export abstract class BaseTransationComponent implements  OnDestroy{

    protected ngUnsubscribe = new Subject<void>();
    @ViewChild('modal_small') protected modalSmall!: ModalComponent;
    modalConfig! : ModalConfig;
    
    enumMovimentacao!: typeof TipoMovimentacao
    enumFormaPagamento!: typeof FormaPagamento
    enumCondicaoPagamento!: typeof CondicaoPagamento
    openModalDelete: boolean = false;
    deleteItem!: TransactionList;


    protected readonly transationService: TransationService
    protected readonly alertService: AlertModalService
    // resourceData!: T
  
    id!: number;

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    constructor(
        public injector: Injector,)
     {
        this.enumMovimentacao = TipoMovimentacao;
        this.enumFormaPagamento = FormaPagamento;
        this.enumCondicaoPagamento = CondicaoPagamento;
        
        this.transationService = this.injector.get(TransationService)
        this.alertService = this.injector.get(AlertModalService)

    }
  
  
    changeConsolidated(item: TransactionList, type : string){

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
    
            if(type == 'account'  || type == 'member' || type=='overdue'){
              setTimeout(() =>{
                window.location.reload();
              }, 500)
            }
            
            console.log("delete transation success", data)
          },
          error: (error: HttpErrorResponse) =>{
            console.log('error delete transation', error)
          }
        })
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

   
}  