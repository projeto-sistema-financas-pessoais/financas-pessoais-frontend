import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TransationService } from 'src/app/features/pages/transaction/shared/services/transation.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from 'src/app/features/pages/account/shared/models/account.model';
import { FamilyMembers } from 'src/app/features/pages/family-members/shared/models/family-members.model';
import { Category } from 'src/app/features/pages/user/shared/models/category.model';
import { CondicaoPagamento, FormaPagamento, TipoConta, TipoMovimentacao, TipoRecorrencia } from '../../models/enum.model';
import { CreditCard } from 'src/app/features/pages/credit-card/shared/models/credit-card.model';
import { DivideMember } from '../../../features/pages/transaction/shared/models/transation.model';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {

  @Input() resourceFormTransfer!: FormGroup
  @Input() resourceFormIncomeExpense!: FormGroup

  @Input() openModalTransfer!: boolean
  @Input() openModalIncome: boolean = false;
  @Input() openModalExpense: boolean = false;

  @Input() selectedCategoryName: string | null = null;
  @Input() selectedCategoryIcon: string | null = null;
  @Input() dropdownOpenCategory: boolean = false;

  @Input() selectedPaymentName: string | null = null;
  @Input() selectedPaymentIcon: string | null = null;
  @Input() dropdownOpenPayment: boolean = false;

  @Input() dropdownOpenAccountCurrent: boolean = false
  @Input() selectedAccontCurrentName: string | null = null;
  @Input() selectedAccontCurrentIcon: string | null = null;

  @Input() dropdownOpenAccountTransfer: boolean = false;
  @Input() selectedAccontTransferName: string | null = null;
  @Input() selectedAccontTransferIcon: string | null = null;

  @Input() account: Account[] = []
  @Input() member: FamilyMembers[] = []

  @Input() nameUser! : string

  @Input() categoryIncome: Category[] = [];
  @Input() categoryExpense: Category[] = [];


  // @Input() divideMember!: FormArray;
  // divideMember!: FormArray

  @Input() creditCard: CreditCard [] = [];

  @Input() accountDebito: Account[] = []
  @Input() accountDinheiro: Account[] = []


  Object = Object

  @Input() quantityMember!: string[]

  enumMovimentacao: typeof TipoMovimentacao
  enumFormaPagamento: typeof FormaPagamento
  filteredformaPagamento!: string[]
  enumTipoConta: typeof TipoConta
  enumCondicaoPagamento: typeof CondicaoPagamento
  filteredCondicaoPagamento!: string[]
  enumTipoRecorrencia: typeof TipoRecorrencia

  protected ngUnsubscribe = new Subject<void>();


  constructor(
    private readonly transationService: TransationService,
    private alertService: AlertModalService,
    private formBuilder: FormBuilder,
  ) {
    this.enumMovimentacao = TipoMovimentacao
    this.enumFormaPagamento = FormaPagamento;
    this.enumTipoRecorrencia = TipoRecorrencia;
    this.enumCondicaoPagamento = CondicaoPagamento;
    this.enumTipoConta = TipoConta;
    this.filteredformaPagamento = Object.values(this.enumFormaPagamento).filter(item => item !== 'Crédito');
    this.filteredCondicaoPagamento = Object.values(this.enumCondicaoPagamento).filter(item => item !== 'Parcelado');

   }

  ngOnInit() {
  }

  get divideMember(): FormArray {
    return this.resourceFormIncomeExpense.get('divide_parente') as FormArray;
  }
 
  checkIfAccountTransf(){
    const atual = this.resourceFormTransfer.get('id_conta_atual')?.value
    const transf = this.resourceFormTransfer.get('id_conta_transferencia')?.value
    return atual  == transf && atual!= null && transf !== null
  }

  toggleDropdownCategory() {
    this.dropdownOpenCategory = !this.dropdownOpenCategory;
  }

  toggleDropdownPayment(){
    this.dropdownOpenPayment= !this.dropdownOpenPayment;

  }

  toggleDropdownAccountTransfer(){
    this.dropdownOpenAccountTransfer= !this.dropdownOpenAccountTransfer;

  }

  toggleDropdownAccountCurrent(){
    this.dropdownOpenAccountCurrent= !this.dropdownOpenAccountCurrent;

  }

  selectAccountTransfer(resource: Account){
    this.selectedAccontTransferName = resource.nome;
    this.selectedAccontTransferIcon = resource.nome_icone;
    this.resourceFormTransfer.get('id_conta_transferencia')?.setValue(resource.id_conta)
    this.dropdownOpenAccountTransfer = false;
  }

  selectPayment(resource: any, type: string) {


    this.selectedPaymentName = resource.nome;
    this.selectedPaymentIcon = resource.nome_icone;
    
    let value
    if(type !== this.enumFormaPagamento.CREDITO)
      value = resource.id_conta
    else
      value = resource.id_cartao_credito
    
    this.resourceFormIncomeExpense.get('id_financeiro')?.setValue(value)

    this.dropdownOpenPayment = false;
  }

  selectCategory(category: Category) {
    this.selectedCategoryName = category.nome;
    this.selectedCategoryIcon = category.nome_icone;
    this.resourceFormIncomeExpense.get('id_categoria')?.setValue(category.id_categoria)
    this.dropdownOpenCategory = false;
  }


  selectAccountCurrent(resource: Account){
    this.selectedAccontCurrentName = resource.nome;
    this.selectedAccontCurrentIcon = resource.nome_icone;
    this.resourceFormTransfer.get('id_conta_atual')?.setValue(resource.id_conta)
    this.dropdownOpenAccountCurrent = false;
  }

  cleanSelected(){
    this.selectedPaymentName = null;
    this.selectedPaymentIcon = null;
    this.resourceFormIncomeExpense.get('id_financeiro')?.setValue(null)

  }

  changeConsolidado(){
    const value =  this.resourceFormIncomeExpense.get('consolidado')?.value
    this.resourceFormIncomeExpense.get('consolidado')?.setValue(!value)   
  }

  
  createDivideMember(memberId: number | null, value: number): FormGroup{
    return this.formBuilder.group({
      id_parente: [memberId, Validators.required],
      valor_parente: [value, Validators.required],
    });
  }

  createMember(){
    const quantity = this.resourceFormIncomeExpense.get('quantity_member')?.value
    const valueTotal = this.resourceFormIncomeExpense.get('valor')?.value;

    this.divideMember.clear()
    if(quantity !== "Somente eu"){

      const quantityNumber = Number(quantity)
      const valueMember = valueTotal / quantityNumber;
      const valueMemberFinal = Math.round(valueMember* 100) / 100;
      const remainingValue = Math.round((valueTotal - (valueMemberFinal * quantityNumber)) *100) /100;


      for(let i = 0; i < Number(quantity); i++){
        console.log("entrou")
        let valueSend;
        let  memberId;
        i == 0 ?  valueSend = valueMemberFinal + remainingValue :  valueSend = valueMemberFinal
        const value = Number(valueSend.toFixed(2))
        memberId = this.member[i].id_parente || null

        this.divideMember.push(this.createDivideMember(memberId, value));
      }
    }
  }

  addTransationTransfer(reload: boolean){
    let resource = Object.assign({}, this.resourceFormTransfer.value);
    this.transationService.addTransfer(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(data) => {
        this.alertService.showAlertSuccess("Sucesso ao fazer transferência!")

        if(reload){
          setTimeout(() =>{
            window.location.reload();
          }, 1000)
        }
        else {
          this.resourceFormTransfer.get('valor')?.setValue(null)
          this.resourceFormTransfer.get('descricao')?.setValue(null)

        }
      },
      error:(error: HttpErrorResponse) =>{
        console.error(error)
      }
    })
    

  }

  setDivideMember(resource: any){
    let member: FamilyMembers | undefined;

    if(resource.quantity_member == "Somente eu" || isNaN(Number(resource.quantity_member))){
      
      member = this.member.find(item => item.nome == this.nameUser)

      if(member)
        resource.divide_parente = [{
          id_parente: member.id_parente,
          valor_parente: resource.valor
        }]
    }

  
    return resource
  }
  
  addTransationExpense(reload: boolean){
    let resource =  Object.assign({}, this.resourceFormIncomeExpense.value);
    
    resource = this.setDivideMember(resource);

    console.log("resource", resource)

    this.transationService.addExpense(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(data) => {
        this.alertService.showAlertSuccess("Sucesso ao salvar nova despesa!")
        if(reload){
          setTimeout(() =>{
            window.location.reload();
          }, 1000)
        }
        else {
          this.resourceFormIncomeExpense.get('valor')?.setValue(null)
          this.resourceFormIncomeExpense.get('descricao')?.setValue(null)

        }
        console.log('sucesso', data)
      },
      error:(error: HttpErrorResponse) =>{
        console.error(error)
      }
    })
  }


  addTransationIncome(reload: boolean) {
    let resource =  Object.assign({}, this.resourceFormIncomeExpense.value);
    
    resource = this.setDivideMember(resource);

    console.log("resource", resource)

    this.transationService.addIncome(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(data) => {
        this.alertService.showAlertSuccess("Sucesso ao salvar nova receita!")
        if(reload){
          setTimeout(() =>{
            window.location.reload();
          }, 1000)
        }
        else {
          this.resourceFormIncomeExpense.get('valor')?.setValue(null)
          this.resourceFormIncomeExpense.get('descricao')?.setValue(null)

        }
        console.log('sucesso', data)
      },
      error:(error: HttpErrorResponse) =>{
        console.error(error)
      }
    })  }


}
