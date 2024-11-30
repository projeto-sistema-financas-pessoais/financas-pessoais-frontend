import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { Overdue } from '../models/overdue.model';

@Injectable({
  providedIn: 'root'
})
export class OverdueService {

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

  getOverdue(tipoReceita: boolean): Observable<Overdue>{
    return this.http.get<Overdue>(`${environment.financas}/movimentacao/movimentacoes_vencidas/${tipoReceita}` ,{headers: this.headers})
  }
}
