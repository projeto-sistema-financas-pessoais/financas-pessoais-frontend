import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Register } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  protected http: HttpClient;

  constructor(
    public injector: Injector, 
  ){
    this.http = injector.get(HttpClient);    
  }

  register(requestData: Register): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: "no-cache",
      })
    };
    return this.http.post<any>(`${environment.financas}/auth/register`,
      requestData, httpOptions
    )
  }
}
