import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from '../shared/models/register.model';
import { AuthService } from '../shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy{

  resourceForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  private readonly ngUnsubscribe = new Subject<void>();
  data_nascimento!: Date

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
      nome_completo: [null, [Validators.required, Validators.minLength(3)]],
      data_nascimento: [null, [Validators.required ]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  formateDate(data: string): Date {
    const day = Number(data.substring(0, 2));
    const month = Number(data.substring(2, 4))-1;
    const year = Number(data.substring(4, 8));
    const date = new Date(year, month, day)

    console.log(day, month, year, date)
    return date

  }

  submitForm(){
    let valueSubmit: Register = Object.assign(new Register(), this.resourceForm.value);

    console.log("data,",  valueSubmit.data_nascimento, valueSubmit)
    this.authService.register(valueSubmit)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: async(data: any) =>{
        console.log("Salvo com sucesso! ", data)
        this.alertService.showAlertSuccess("Cadastro feito com sucesso!")

        setTimeout( () => {
          window.location.href= '/login';
        },800)
      },
      error:(error: any) =>{
        console.log("Error", error, valueSubmit);
        if(error.status == 409)
          this.alertService.showAlertDanger("Email já cadastrado!")
        else
          this.alertService.showAlertDanger("Erro ao fazer cadastro!")

      }
    })

  }
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  checkPassword(){
    return this.resourceForm.get('confirmPassword')?.value.length >= 6 &&  
    this.resourceForm.get('confirmPassword')?.value !==  this.resourceForm.get('senha')?.value;
  }
}
