import { Injectable, Injector } from '@angular/core';
import { CreditCard } from '../models/credit-card.model';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService extends  BaseFormService<CreditCard>{

  constructor(injector: Injector) {
    super('cartaoCredito', 'cartao_credito', injector) 
  }

}
