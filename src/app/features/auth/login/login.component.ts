import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { AuthService } from '../shared/services/auth.service';
import { LoginResponse } from '../shared/models/login.modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  resourceForm!: FormGroup;
  response!: LoginResponse;


  private ngUnsubscribe = new Subject<void>();

  constructor(
    protected formBuilder: FormBuilder,
    protected authService: AuthService,
    protected alertService: AlertModalService
  ){}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.buildResourceForm();
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required]],
    });
  }


  submitForm(){
    console.log("okayyy", this.resourceForm.value)
    let resource = Object.assign({}, this.resourceForm.value);
    this.authService.login(resource)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.response = response
          sessionStorage.setItem('access_token', JSON.stringify(response.acesso_token));
          sessionStorage.setItem('user_name', JSON.stringify(response.nome));

          console.log("login response", response)
          this.alertService.showAlertSuccess("Sucesso ao fazer login")

          setTimeout( () => {
            window.location.href = '/inicio'
          },1000)
         
        },
        error: (error) => {
          console.log("error login", error)
          this.alertService.showAlertDanger("Problema ao fazer login: verifique se os dados estão corretos")
        }
      }
    )
  }
}
