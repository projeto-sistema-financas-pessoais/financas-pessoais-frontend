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

  updateUser(userData: User): Observable<User> {
    return this.http.put<User>(`${environment.financas}/${this.apiPath}/`, {headers: this.headers});
  }
}
