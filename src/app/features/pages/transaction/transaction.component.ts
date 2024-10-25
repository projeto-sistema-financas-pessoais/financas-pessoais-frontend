import { Component, OnInit, ViewChild } from '@angular/core';
import { TransationService } from '../transaction/shared/services/transation.service';
import { TransationFilter, TransationList } from './shared/models/transation-list.model';
import { Subject, takeUntil } from 'rxjs';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from './shared/models/transation-enum.model';
import { CategoryService } from '../user/shared/models/services/category.service';
import { Category } from '../user/shared/models/category.model';

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
  


  category!: Category[]
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
  

  transationList: TransationList[] = [];
  transationFilter!: TransationFilter ;

  enumMovimentacao!: typeof TipoMovimentacao
  // movimentacaoValues = Object.values(TipoMovimentacao);


  enumFormaPagamento!: typeof FormaPagamento
  enumCondicaoPagamento!: typeof CondicaoPagamento
  Object = Object;

  canOpenFilter: boolean = false;


  constructor(
    private readonly transationService: TransationService,
    private readonly categoryService: CategoryService){
    this.enumMovimentacao = TipoMovimentacao;
    this.enumFormaPagamento = FormaPagamento;
    this.enumCondicaoPagamento = CondicaoPagamento;

    this.transationFilter = new TransationFilter()
    this.transationFilter.ano = new Date().getFullYear();
    this.transationFilter.mes = new Date().getMonth() + 1;
    this.transationFilter.id_categoria = null
  }

  ngOnInit(): void {
    this.chargeList();
    this.getCategory()
    console.log("month", this.month)
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
    this.categoryService.getAll()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Category[]) => {
        this.category = data;
      },
      error: (error: HttpErrorResponse) =>{

      }
    })
  }

  protected openDelete(item: TransationList){

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

  // day(data: Date){
  //   const validDate = new Date(data); // Converte o valor em um objeto Date
  //   console.log(validDate.getDate())

  //   return data
  // }
}
