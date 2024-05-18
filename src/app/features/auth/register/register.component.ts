import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from '../shared/models/register.model';
import { RegisterService } from '../shared/services/register.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';

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
    protected registerService: RegisterService,
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
      data_nascimento: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  // validatorsDate(control: AbstractControl): { [key: string]: any } | null {
  //   const date = control.value;
  //   if (!date) {
  //     return null;
  //   }
  
  //   const dateFormat = this.formateDate(date);
  
  //   const year =  dateFormat.getFullYear();
  //   const month = dateFormat.getMonth() +1;

  //   console.log( "mes", month)
  //   const day = dateFormat.getDate();
  
  //   const yearToday = new Date().getFullYear();
  
  //   if (year < 1900 || year > yearToday) {
  //     return { dateInvalid: true };
  //   }
  
  //   if (month < 1 || month > 12) {
  //     return { dateInvalid: true };
  //   }
  
  //   let maxDaysInMonth = 31;
  //   if (month !== 2) {
  //     maxDaysInMonth = new Date(year, month, 0).getDate();
  //   } else {
  //     if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
  //       maxDaysInMonth = 29;
  //     } else {
  //       maxDaysInMonth = 28;
  //     }
  //   }

  //   console.log( "oi", maxDaysInMonth, month)

  //   if (day < 1 || day > maxDaysInMonth) {
  //     return { dateInvalid: true };
  //   }

  //   return null;
  // }

  formateDate(data: string): Date {
    const dia = Number(data.substring(0, 2));
    const mes = Number(data.substring(2, 4))-1;
    const ano = Number(data.substring(4, 8));
    console.log(dia, mes, ano)
    return new Date(ano, mes, dia)
  }

  submitForm(){
    let valueSubmit: Register = Object.assign(new Register(), this.resourceForm.value);
    if(valueSubmit.data_nascimento != null){
      const dataNascimentoTimestamp =this.formateDate(this.resourceForm.value.data_nascimento).toISOString()
      valueSubmit.data_nascimento = dataNascimentoTimestamp
    }

    this.registerService.register(valueSubmit)
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
