import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';
import { MonthBudgetCategory } from '../models/month-budget-category.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { EconomyMonth } from '../models/economy-month.models';
import { IncomeExpense } from '../models/income-expense.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  protected http: HttpClient;
  public auth: AuthService;
  headers: any;

  constructor(
    public injector: Injector, 
  ){
    this.http = injector.get(HttpClient);    
    this.auth = injector.get(AuthService);
    this.headers = this.auth.GetToken();
  }

  getMonthBudgetCategory(): Observable<MonthBudgetCategory>{
    return this.http.get<MonthBudgetCategory>(`${environment.financas}/movimentacao/orcamento-mensal` ,{headers: this.headers})
  }

  getEconomyMonth(onlyUser: boolean): Observable<EconomyMonth[]>{
    return this.http.get<EconomyMonth[]>(`${environment.financas}/movimentacao/economia-meses-anteriores?somente_usuario=${onlyUser}` ,{headers: this.headers})
  }

  getIncomeExpense(type: boolean, onlyUser: boolean): Observable<IncomeExpense>{
    return this.http.get<IncomeExpense>(`${environment.financas}/movimentacao/gastos-receitas-por-categoria?tipo_receita=${type}&somente_usuario=${onlyUser}` ,{headers: this.headers})
  }

}