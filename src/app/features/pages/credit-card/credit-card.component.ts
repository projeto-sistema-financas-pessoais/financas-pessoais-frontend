import { Component, Injector } from '@angular/core';
import { CreditCard } from './shared/models/credit-card.model';
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { CreditCardService } from './shared/services/credit-card.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent  extends BaseFormComponent<CreditCard>{


  constructor(
    protected readonly creditCard: CreditCardService,
    injector : Injector,

     ){
    super(injector, new CreditCard({}), 'cartao_credito', 'Cartão de Crédito', creditCard);
  }
  
  protected override buildForm(): void {
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required]],
      limite: [null, [Validators.required]],
      nome_icone: [this.imageSelected, [Validators.required]],
      ativo: [true],

    });
  }
}
