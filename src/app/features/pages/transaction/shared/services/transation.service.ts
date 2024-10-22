import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';
import { TransationFilter, TransationList } from '../models/transation-list.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TransationService  {

  protected http: HttpClient;
  public auth: AuthService;
  headers: any;

  constructor(
    public injector: Injector, 
  ){
    this.http = injector.get(HttpClient);    
    this.auth = injector.get(AuthService);
    this.headers = this.auth.GetToken();
  }

  getAllByFilter(filter: TransationFilter): Observable<TransationList[]>{
    return this.http.post<TransationList[]>(`${environment.financas}/movimentacao/listar/filtro`, filter ,{headers: this.headers})
  }
}