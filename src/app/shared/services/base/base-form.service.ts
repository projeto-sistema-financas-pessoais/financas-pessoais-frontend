import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { BaseModel } from '../../models/base/base-model.model';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseFormService<T extends BaseModel> {

  protected http: HttpClient;
  public auth: AuthService;
  headers: any;

  constructor(
    public apiPath: string, 
    public name: string,
    public injector: Injector, 
  ){
    this.http = injector.get(HttpClient);    
    this.auth = injector.get(AuthService);
    this.headers = this.auth.GetToken();
  }

  getAll(): Observable<T[]>{
    return this.http.get<T[]>(`${environment.financas}/${this.apiPath}/listar`, {headers: this.headers})
  }

  addResource(resource: T):Observable<T>{
    return this.http.post<T>(`${environment.financas}/${this.apiPath}/cadastro`, resource, {headers: this.headers})
  }



  deleteResource(id: number):Observable<any>{
    return this.http.delete<any>(`${environment.financas}/${this.apiPath}/deletar/${id}`, {headers: this.headers})
  }


  editResource(resource: T):Observable<T>{
    return this.http.put<T>(`${environment.financas}/${this.apiPath}/editar/${resource[`id_${this.name}`]}`, resource , {headers: this.headers})
  }

  getById(id: number):Observable<T>{
    return this.http.get<T>(`${environment.financas}/${this.apiPath}/visualizar/${id}` , {headers: this.headers})
  }

}
