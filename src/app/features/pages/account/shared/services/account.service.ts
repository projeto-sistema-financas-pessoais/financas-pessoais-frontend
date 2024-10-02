import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { Account } from '../models/account.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService{

  constructor(injector: Injector) {
    super(injector) 
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
