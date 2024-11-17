import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Account } from 'src/app/features/pages/account/shared/models/account.model';
import { AccountService } from 'src/app/features/pages/account/shared/services/account.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {

  protected ngUnsubscribe = new Subject<void>();

  account: Account[] = []
  saldoTotal!: number;
  
  constructor(
    protected readonly accountService: AccountService,
  ) {
   }

  ngOnInit(): void {
    this.getAllAccount(false);

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected getAllAccount(somenteAtivo: boolean){
    this.accountService.getAll(false)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Account[])=>{
        console.log("data", data)
        this.account = data;

        this.saldoTotal = this.account.reduce((accumulator, item) => {
          return accumulator + Number(item.saldo);
        }, 0);
      },
      error: (error) => {
        console.log("error to get all", error)
      }
    })
  }
}
