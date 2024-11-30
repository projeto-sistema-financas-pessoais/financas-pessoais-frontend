import { BaseTransationComponent } from 'src/app/shared/components/base/base-transation.component';
import { Component, Injector, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'app-transactions',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionsComponent  extends BaseTransationComponent implements OnInit{

  nameUser!: string

  invalidMember: boolean = false

  Object = Object


  isMobile: boolean = false;
  
  constructor(
    private readonly observer: BreakpointObserver,
    injector: Injector
    ){

    super(injector);

  }

  ngOnInit(): void {

    this.nameUser = this.authService.GetUser().name || 'null'

    this.observer.observe(['(max-width: 1024px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

   
  }


  onKeyDownOpenIncome(event: KeyboardEvent){
    if (event.key === 'Enter' || event.key === ' ') {
      this.openIncome(); 
      event.preventDefault(); 
    }

  }

  onKeyDownOpenExpense(event: KeyboardEvent){
    if (event.key === 'Enter' || event.key === ' ') {
      this.openExpense(); 
      event.preventDefault(); 
    }

  }

  onKeyDownOpenTransfer(event: KeyboardEvent){
    if (event.key === 'Enter' || event.key === ' ') {
      this.openTransfer(); 
      event.preventDefault(); 
    }

  }

}
