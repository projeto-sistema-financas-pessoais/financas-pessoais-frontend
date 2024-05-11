import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      data_nascimento: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  submitForm(){
    let valueSubmit: Register = Object.assign(new Register(), this.resourceForm.value);

    this.registerService.register(valueSubmit)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: async(data: any) =>{
        console.log("Salvo com sucesso! ", data)
        this.alertService.showAlertSuccess("Cadastro feito com sucesso!")
      },
      error:(error: any) =>{
        console.log("Error", error);
        this.alertService.showAlertDanger("Erro ao fazer cadastro!")

      }
    })

  }
}
