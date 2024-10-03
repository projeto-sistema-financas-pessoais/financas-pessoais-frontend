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

}
