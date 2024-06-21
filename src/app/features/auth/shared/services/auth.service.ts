import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Register } from '../models/register.model';
import { Login, LoginResponse } from '../models/login.modal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected http: HttpClient;
  header: HttpHeaders = new HttpHeaders;


  constructor(
    public injector: Injector, 
  ){
    this.http = injector.get(HttpClient);    
  }

  register(requestData: Register): Observable<any> {
    return this.http.post<any>(`${environment.financas}/clientes/`,
      requestData
    )
  }


  login(requestData: Login): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.financas}/auth/login`,
    requestData
    )
  }

  public GetToken(){

    const token = JSON.parse(sessionStorage.getItem('access_token')!) as string;
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    this.header = headers;
    this.header = headers;

    return headers;
  }

  public token (){
    const token = this.GetToken();

    const authorizationHeader = token.get('authorization');
    if(authorizationHeader == "Bearer null" ){
      return false;
    }
    
    return true;
  }
}
