import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CreditCard } from 'src/app/features/pages/credit-card/shared/models/credit-card.model';
import { CreditCardService } from 'src/app/features/pages/credit-card/shared/services/credit-card.service';

@Component({
  selector: 'app-credit-finance',
  templateUrl: './credit-finance.component.html',
  styleUrls: ['./credit-finance.component.scss']
})
export class CreditFinanceComponent implements OnInit {

  protected ngUnsubscribe = new Subject<void>();

  creditCard: CreditCard[] = [];
  faturaTotal!: number;

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

  monthStatement: string = ''

  constructor(
    protected readonly creditCardService: CreditCardService,
  ) { }


  ngOnInit(): void {
    this.getAllAccount();

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected getAllAccount(){
    this.creditCardService.getAll(false)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: CreditCard[])=>{
        console.log("data", data)
        this.creditCard = data;

        if(data[0] && data[0].data_fechamento){
          const [, month1, ] = String(data[0].data_fechamento).split('-').map(Number);

          this.monthStatement = this.month[month1 -1]
        }else{
          this.monthStatement = ''
        }
        
        this.faturaTotal = this.creditCard.reduce((accumulator, item) => {
          return accumulator + Number(item.fatura_gastos);
        }, 0);
      },
      error: (error) => {
        console.log("error to get all", error)
      }
    })
  }
}
