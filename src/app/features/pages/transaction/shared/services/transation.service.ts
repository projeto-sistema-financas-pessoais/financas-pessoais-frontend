import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';
import { TransationFilter, TransactionList } from '../models/transation-list.model';
import { environment } from 'src/environments/environment.development';
import { RegisterExpenseIncome, RegisterTransfer, TransationConsolidated } from '../models/transation.model';

@Injectable({
  providedIn: 'root'
})
export class TransationService  {

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

  getAllByFilter(filter: TransationFilter): Observable<TransactionList[]>{
    return this.http.post<TransactionList[]>(`${environment.financas}/movimentacao/listar/filtro`, filter ,{headers: this.headers})
  }

  addTransfer(resource: RegisterTransfer): Observable<RegisterTransfer>{
    return this.http.post<RegisterTransfer>(`${environment.financas}/movimentacao/cadastro/transferencia`, resource ,{headers: this.headers})
  }

  addExpense(resource: RegisterExpenseIncome): Observable<RegisterExpenseIncome>{
    return this.http.post<RegisterExpenseIncome>(`${environment.financas}/movimentacao/cadastro/despesa`, resource ,{headers: this.headers})
  }

  addIncome(resource: RegisterExpenseIncome): Observable<RegisterExpenseIncome>{
    return this.http.post<RegisterExpenseIncome>(`${environment.financas}/movimentacao/cadastro/receita`, resource ,{headers: this.headers})
  }

  deleteTransation(transationId: number): Observable<any>{
    return this.http.delete<any>(`${environment.financas}/movimentacao/deletar/${transationId}` ,{headers: this.headers})
  }

  consolidatedTransation(transationConsolidated: TransationConsolidated): Observable<any>{
    return this.http.post<any>(`${environment.financas}/movimentacao/consolidar` , transationConsolidated, {headers: this.headers})
  }

  changeLimitAndExpense(idMovimentacao: number, change: Boolean): Observable<any>{
    return this.http.post<any>(`${environment.financas}/movimentacao/participa_limite_faturas_gastos?id_movimentacao=${idMovimentacao}&participa_limite_fatura_gastos=${change}` ,null, {headers: this.headers})
  }

  editTransation(idMovimentacao: number, resource: any): Observable<any>{
    return this.http.post<any>(`${environment.financas}/movimentacao/editar/${idMovimentacao}` ,resource, {headers: this.headers})
  }


  
}