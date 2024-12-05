import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseTransationComponent } from 'src/app/shared/components/base/base-transation.component';
import { OverdueService } from '../../services/overdue.service';
import { FaturaInfo, TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';
import { takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Overdue } from '../../models/overdue.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overdue',
  templateUrl: './overdue.component.html',
  styleUrls: ['./overdue.component.scss']
})
export class OverdueComponent extends BaseTransationComponent implements OnInit {

  @Input() type: boolean = true;

  transactionList: TransactionList[] = [];
  faturaInfo: FaturaInfo[] = []

  nameUser!: string;

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


  constructor(
    private readonly overdueService: OverdueService,
    private readonly router: Router,
    injector : Injector,
    ) { 
    super(injector);

  }

  ngOnInit() {

    this.nameUser = this.authService.GetUser().name || 'null'

    this.getOverdue()
  }

  
  getOverdue() {
    this.overdueService.getOverdue(this.type)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Overdue) => {
          this.transactionList = data.movimentacoes;
          this.faturaInfo = data.faturas    
          console.log( "list",data)
      }, 
      error: (error: HttpErrorResponse) => {
        
        if(error.status == 404){
          this.transactionList = []
        }
        console.error("error to get overdue ",this.type, error)
      }
    })
  }

  getMonth(date: string) {
    const [, month1, ] = String(date).split('-').map(Number);

    return this.month[month1 -1]
  }

  setQuery(item: FaturaInfo){
    const [year1, month1, ] = String(item.data_fechamento).split('-').map(Number);


    let queryParams: any = {mes:  month1, ano:  year1};
    const url = this.router.createUrlTree([`/cartao-de-credito/fatura-e-movimentacoes-do-cartao/${item.id_cartao_credito}`], { queryParams }).toString();
    window.location.href = url
  }

  onKeyDownChangeConsolidated(event: KeyboardEvent, item: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.changeConsolidated(item, 'overdue'); 
      event.preventDefault(); 
    }
  }

  onKeyQuery(event: KeyboardEvent, item: FaturaInfo){
    if (event.key === 'Enter' || event.key === ' ') {
      this.setQuery(item); 
      event.preventDefault(); 
    }
  }
  
  navigateTransation(){
    if(this.type)
      localStorage.setItem('openModal', JSON.stringify('income'));
    else
      localStorage.setItem('openModal', JSON.stringify('expense'));

  }
}
