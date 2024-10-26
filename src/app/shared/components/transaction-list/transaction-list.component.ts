import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from 'src/app/shared/models/enum.model';
import { TransationFilter, TransationList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';
import { TransationService } from 'src/app/features/pages/transaction/shared/services/transation.service';
import { Category } from 'src/app/features/pages/user/shared/models/category.model';
import { CategoryService } from 'src/app/features/pages/user/shared/models/services/category.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  protected ngUnsubscribe = new Subject<void>();

  @Input() type: 'transation' | 'member' | 'account' | 'credit' = 'transation'
  @Input() id_type?: number;


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

 


  constructor(private readonly transationService: TransationService,
    private readonly categoryService: CategoryService){

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

  }

}
