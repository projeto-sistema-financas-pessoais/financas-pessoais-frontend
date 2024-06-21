import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Register } from '../shared/models/register.model';
import { AuthService } from '../shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';


export function dataNascimentoValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; 
    }

    const day = Number(control.value.substring(0, 2));
    const month = Number(control.value.substring(2, 4));
    const year = Number(control.value.substring(4, 8));

    const isValidDate = day >= 1 && day <= 31 &&
                        month >= 1 && month <= 12 &&
                        year >= 1900 && year <= new Date().getFullYear();

    if (!isValidDate) {
      return { 'dateInvalid': { value: control.value } }; 
    }

    let maxDaysInMonth = 31;
    if (month !== 2) {
      maxDaysInMonth = new Date(year, month, 0).getDate();
    } else {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        maxDaysInMonth = 29;
      } else {
        maxDaysInMonth = 28;
      }
    }

    // console.log("maxDaysIn", maxDaysInMonth)
    if (day < 1 || day > maxDaysInMonth) {
      return { 'dateInvalid': { value: control.value } }; 
    }

    return null; 
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy{

  resourceForm!: FormGroup;

  private ngUnsubscribe = new Subject<void>();
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
      data_nascimento: [null, [Validators.required, dataNascimentoValidator()]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]],
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
    if(valueSubmit.data_nascimento != null){
      const dataNascimentoTimonthtamp =this.formateDate(this.resourceForm.value.data_nascimento).toISOString()
      valueSubmit.data_nascimento = dataNascimentoTimonthtamp
    }

    console.log("data,",  valueSubmit.data_nascimento, valueSubmit)
    this.authService.register(valueSubmit)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: async(data: any) =>{
        console.log("Salvo com sucesso! ", data)
        this.alertService.showAlertSuccess("Cadastro feito com sucesso!")
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
}
