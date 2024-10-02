import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { environment } from 'src/environments/environment.development';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseFormService<Account>{

  constructor(injector: Injector) {
    super('contas', 'conta', injector) 
  }

  getAccount(): Observable<Account[]>{
    return this.http.get<Account[]>(`${environment.financas}/contas/listar`, {headers: this.headers})
  }

  addAccount(resource: Account):Observable<Account>{
    return this.http.post<Account>(`${environment.financas}/contas/cadastro`, resource, {headers: this.headers})
  }

  deleteAccount(id: number):Observable<any>{
    return this.http.delete<any>(`${environment.financas}/contas/deletar/${id}`, {headers: this.headers})
  }

  editAccount(resource: Account):Observable<Account>{
    return this.http.put<Account>(`${environment.financas}/contas/editar/${resource.id_conta}`, resource , {headers: this.headers})
  }

}
