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
      cpf: [null, [Validators.required, Validators.minLength(11)]],
      data_nascimento: [null],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  validatorsDate(control: AbstractControl): { [key: string]: any } | null {
    const date = control.value;
    if (!date) {
      return null;
    }

    const [dia, mes, ano] = date.split('/').map(Number);

    const data = new Date(ano, mes - 1, dia); // mês é base 0 em Date
    if (
      data.getFullYear() !== ano ||
      data.getMonth() + 1 !== mes ||
      data.getDate() !== dia
    ) {
      return { dataInvalida: true };
    }

    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual) {
      return { anoInvalido: true };
    }

    return null;
  }


  formateDate(data: string): Date {
    // A data vem no formato "DDMMYYYY", então vamos formatá-la para "YYYY-MM-DD"
    const dia = Number(data.substring(0, 2));
    const mes = Number(data.substring(2, 4));
    const ano = Number(data.substring(4, 8));
 
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
        this.alertService.showAlertDanger("Erro ao fazer cadastro!")

      }
    })

  }
}
