import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Register } from '../models/register.model';
import { Login, LoginResponse } from '../models/login.modal';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected http: HttpClient;
  header: HttpHeaders = new HttpHeaders;

  constructor(
    public injector: Injector, 
    private router: Router
  ){
    this.http = injector.get(HttpClient);    
  }

  register(requestData: Register): Observable<any> {
    return this.http.post<any>(`${environment.financas}/usuarios/cadastro`,
      requestData
    )
  }

  login(requestData: Login): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', requestData.email) // FastAPI espera o campo 'username' para login
      .set('password', requestData.senha);

    return this.http.post<LoginResponse>(`${environment.financas}/usuarios/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  resetPassword(token: string, requestData: { password: string }): Observable<any> {
    return this.http.post<any>(`${environment.financas}/reset-password/${token}`, requestData);
  }

  sendRecoveryEmail(data: { email: string }): Observable<any> {
    return this.http.post<any>(`${environment.financas}/usuarios/recover-password`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
    

  public GetToken(){
    const token = JSON.parse(localStorage.getItem('access_token')!) as string;
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
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

  public GetUser(): string | null {
    return  JSON.parse(localStorage.getItem('user_name')!) as string;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    this.router.navigate(['/login']);
  }
}
