import { Component, OnInit, ViewChild } from '@angular/core';
import { TransationService } from '../transaction/shared/services/transation.service';
import { TransationFilter, TransationList } from './shared/models/transation-list.model';
import { Subject, takeUntil } from 'rxjs';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from './shared/models/transation-enum.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionsComponent implements OnInit{

  protected ngUnsubscribe = new Subject<void>();
  modalConfig! : ModalConfig;
  @ViewChild('modal_default') protected modalDefault!: ModalComponent;

  categorySelected!: string;
  

  categoria = [
    "categoria 1", "categoria 2"
  ]

  transationList: TransationList[] = [];
  transationFilter!: TransationFilter ;

  enumMovimentacao!: typeof TipoMovimentacao
  enumFormaPagamento!: typeof FormaPagamento
  enumCondicaoPagamento!: typeof CondicaoPagamento


  constructor(private readonly transationService: TransationService){
    this.enumMovimentacao = TipoMovimentacao;
    this.enumFormaPagamento = FormaPagamento;
    this.enumCondicaoPagamento = CondicaoPagamento;

    this.transationFilter = new TransationFilter()
    this.transationFilter.ano = new Date().getFullYear();
    this.transationFilter.mes = new Date().getMonth() + 1;
  }

  ngOnInit(): void {
    this.chargeList();
  }


  private chargeList(){
    this.transationService.getAllByFilter(this.transationFilter)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: TransationList[]) => {
          this.transationList = data;
          console.log(this.transationList)
      }, 
      error: (error: HttpErrorResponse) => {
        console.error("error to get list of transations", error)
      }
    })
  }

  protected openDelete(item: TransationList){

  }


  day(data: Date){
    const validDate = new Date(data); // Converte o valor em um objeto Date
    console.log(validDate.getDate())

    return data
  }
}
