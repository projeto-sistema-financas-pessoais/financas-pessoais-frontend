import { Injectable, Injector } from '@angular/core';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends  BaseFormService<Category>{

  constructor(injector: Injector) {
    super('categorias', 'categoria', injector) 
  }

  getAllIncome(somenteAtivo: boolean): Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.financas}/${this.apiPath}/listar/receita/${somenteAtivo}`, {headers: this.headers})
  }

  getAllExpense(somenteAtivo: boolean): Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.financas}/${this.apiPath}/listar/despesa/${somenteAtivo}`, {headers: this.headers})
  }
}
