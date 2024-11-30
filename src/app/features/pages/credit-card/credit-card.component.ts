import { Component, Injector, ViewChild } from '@angular/core';
import { CreditCard } from './shared/models/credit-card.model';
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { CreditCardService } from './shared/services/credit-card.service';
import { Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

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

  focusedField: string | null = null;
  @ViewChild('modal_small') protected modalSmall!: ModalComponent;
  openModalDelete: boolean = false;
  private currentCardId: number = 0;
  protected currentCardName: string = '';
  isEditMode: boolean = false;
  
  monthNew: string = '';

  month = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  protected getMonth(value: any) {
    const [, month1, ] = String(value).split('-').map(Number);
    this.monthNew = this.month[month1-1];
  }
  


  protected openDelete(id_cartao_credito: number, nome: string) {
 
    this.currentCardId = id_cartao_credito;
    this.currentCardName = nome; 
    this.openModalDelete = true;
    this.modalConfig = {
      modalTitle: 'Excluir cartão de crédito'
    }
    this.modalSmall.openSmall();
  }
  protected onDelete() {
    super.deleteResource(this.currentCardId);
    this.modalSmall.dismiss(); 
  }
  protected override buildForm(item: CreditCard): void {
    if(item){
      this.getMonth(item.data_fechamento);
    }
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required]],
      limite: [null, [Validators.required]],
      nome_icone: [this.imageSelected, [Validators.required]],
      ativo: [true],
      dia_fechamento: [null, [Validators.required, Validators.min(1), Validators.max(30)]], 
      dia_vencimento: [null, [Validators.required, Validators.min(1), Validators.max(30)]], 
    });
  }

  protected override enableForm(enable: boolean): void {
  }


}
