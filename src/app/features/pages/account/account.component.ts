import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from './shared/services/account.service';
import { Account } from './shared/models/account.model';
import { Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends BaseFormComponent<Account> implements OnInit, OnDestroy {

  tipoConta: string[] = [
    "Corrente",
    "Poupança",
    "Conta de pagamento",
    "Carteira",
    "Conta Salário"
  ]

  constructor(
    protected readonly accountService: AccountService,
    injector : Injector,

     ){
    super(injector, new Account({}), 'conta', 'Conta', accountService);
  }
  
  protected buildForm(){
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required]],
      descricao: [null, Validators.maxLength(100)],
      tipo_conta: [null, [Validators.required]],
      nome_icone: [this.imageSelected, [Validators.required]],
      ativo: [true],

    });
  }

}
