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
    return this.http.get<Account[]>(`${environment.financas}/contas`, {headers: this.headers})
  }

}
