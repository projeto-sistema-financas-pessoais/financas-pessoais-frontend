import { Injectable, Injector } from '@angular/core';
import { FamilyMembers, MemberSendEmail } from '../models/family-members.model';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyMembersService extends BaseFormService<FamilyMembers>{

  constructor(injector: Injector) {
    super('parente', 'parente', injector) 
  }


  sendEmailBill(statement: MemberSendEmail):Observable<any>{
    return this.http.post<any>(`${environment.financas}/${this.apiPath}/enviar-cobranca` ,statement,  {headers: this.headers})
  }

  cobranca(statement: MemberSendEmail):Observable<any>{
    return this.http.post<any>(`${environment.financas}/${this.apiPath}/cobranca`,  statement, {headers: this.headers})
  }
}
