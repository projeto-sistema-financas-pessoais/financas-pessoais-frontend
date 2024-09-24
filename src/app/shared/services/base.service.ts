import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

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
}
