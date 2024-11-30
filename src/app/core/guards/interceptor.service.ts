import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertModalService } from '../../shared/services/alert-modal.service';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService,
    private readonly alertModelService: AlertModalService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 ) {
          this.alertModelService.showAlertInfo("Você precisa fazer o login novamente!");

          setTimeout( () =>{
            this.authService.logout();

          },1000)
        }
        return throwError(() => error);
      })
    );
  }
}
