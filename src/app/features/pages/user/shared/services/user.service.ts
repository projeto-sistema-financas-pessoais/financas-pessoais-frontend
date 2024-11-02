import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';
import { User } from '../models/user.model'; // Certifique-se de ajustar o caminho conforme necessário
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService extends  BaseFormService<User>{

    constructor(injector: Injector) {
        super('usuarios', 'usuario', injector) 
      }


  getUser(): Observable<User> {
    return this.http.get<User>(`${environment.financas}/${this.apiPath}/listar_usuario`, {headers: this.headers});
  }

  editUser(resource: User): Observable<User> {
    return this.http.put<User>(`${environment.financas}/${this.apiPath}/editar`, resource, {headers: this.headers});
  }



  deleteResourceUser(): Observable<any> {
    return this.http.delete<any>(`${environment.financas}/${this.apiPath}/deletar`, {headers: this.headers});
}
}
