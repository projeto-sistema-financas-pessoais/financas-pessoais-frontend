import { Injectable, Injector } from '@angular/core';
import { CreditCard, StatementSend } from '../models/credit-card.model';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService extends  BaseFormService<CreditCard>{

  constructor(injector: Injector) {
    super('cartaoCredito', 'cartao_credito', injector) 
  }

  closeStatement(statement: StatementSend):Observable<any>{
    return this.http.post<any>(`${environment.financas}/fatura/fechar` ,statement,  {headers: this.headers})
  }

}
