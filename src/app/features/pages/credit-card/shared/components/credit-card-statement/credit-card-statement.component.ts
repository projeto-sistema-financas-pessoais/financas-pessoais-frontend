import { Component, Injector, OnInit } from '@angular/core';
import { CreditCard } from '../../models/credit-card.model';
import { CreditCardService } from '../../services/credit-card.service';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';

@Component({
  selector: 'app-credit-card-statement',
  templateUrl: './credit-card-statement.component.html',
  styleUrls: ['./credit-card-statement.component.scss']
})
export class CreditCardStatementComponent extends BaseGetIdComponent<CreditCard>{


  constructor(  injector : Injector,
    private creditCardService: CreditCardService){
    super(injector, new CreditCard({}), creditCardService );
  }
}


