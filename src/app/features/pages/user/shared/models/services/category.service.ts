import { Injectable, Injector } from '@angular/core';
import { CreditCard } from 'src/app/features/pages/credit-card/shared/models/credit-card.model';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';
import { Category } from '../category.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends  BaseFormService<Category>{

  constructor(injector: Injector) {
    super('categorias', 'categoria', injector) 
  }

  getAllIncome(): Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.financas}/${this.apiPath}/listar/receita`, {headers: this.headers})
  }

  getAllExpense(): Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.financas}/${this.apiPath}/listar/despesa`, {headers: this.headers})
  }
}
