import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../account/shared/services/account.service';
import { Account } from '../account/shared/models/account.model';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CondicaoPagamento, FormaPagamento, TipoConta, TipoMovimentacao, TipoRecorrencia } from '../../../shared/models/enum.model';
import { TransationService } from './shared/services/transation.service';
import { Category } from '../user/shared/models/category.model';
import { CategoryService } from '../user/shared/services/category.service';
import { CreditCard } from '../credit-card/shared/models/credit-card.model';
import { CreditCardService } from '../credit-card/shared/services/credit-card.service';
import { FamilyMembersService } from '../family-members/shared/services/family-members.service';
import { FamilyMembers } from '../family-members/shared/models/family-members.model';
import { AuthService } from '../../auth/shared/services/auth.service';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';

function divideParentValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const valueTotal = formGroup.get('valor')?.value;

    const divideParenteArray = formGroup.get('divide_parente') as FormArray;

    if ( !divideParenteArray || divideParenteArray.length == 0) {
      return null;
    }

    const ids = divideParenteArray.controls.map(control => String(control.get('id_parente')?.value));
    const idsDuplicados = ids.some((id, index) => ids.indexOf(id) !== index);


    if (idsDuplicados) {
      return { duplicateId: true };
    }

    if(!valueTotal){
      return null
    }

    const somaValores = divideParenteArray.controls
      .map(control => control.get('valor_parente')?.value || 0)
      .reduce((acc, curr) => acc + curr, 0);

      const somaArredondada = Math.round(somaValores * 100) / 100;
      const valorTotalArredondado = Math.round(valueTotal * 100) / 100;
  
      // if (somaArredondada !== valorTotalArredondado) {
      //   console.log("Soma membros deu ", somaArredondada, valorTotalArredondado);
      // }
  
      return somaArredondada === valorTotalArredondado ? null : { invalidSum: true };
    };
}



@Component({
  selector: 'app-transactions',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionsComponent implements OnInit{


  protected ngUnsubscribe = new Subject<void>();

  // modals
  @ViewChild('modal_default') protected modalDefault!: ModalComponent;

  modalConfig! : ModalConfig;
  openModalTransfer: boolean = false;
  openModalIncome: boolean = false;
  openModalExpense: boolean = false;

  nameUser!: string

  resourceFormTransfer!: FormGroup;
  resourceFormIncomeExpense!: FormGroup;


  account: Account [] = [];
  accountDebito: Account[] = []
  accountDinheiro: Account[] = []

  creditCard: CreditCard [] = [];

  categoryIncome: Category[] = [];
  categoryExpense: Category[] = [];

  member: FamilyMembers[] = []

  selectedCategoryName: string | null = null;
  selectedCategoryIcon: string | null = null;
  dropdownOpenCategory: boolean = false;

  selectedPaymentName: string | null = null;
  selectedPaymentIcon: string | null = null;
  dropdownOpenPayment: boolean = false;


  dropdownOpenAccountCurrent: boolean = false;
  selectedAccontCurrentName: string | null = null;
  selectedAccontCurrentIcon: string | null = null;

  dropdownOpenAccountTransfer: boolean = false;
  selectedAccontTransferName: string | null = null;
  selectedAccontTransferIcon: string | null = null;
 

  invalidMember: boolean = false


  quantityMember = [
    "Somente eu"
  ]


  enumMovimentacao!: typeof TipoMovimentacao
  enumFormaPagamento!: typeof FormaPagamento
  filteredformaPagamento!: string[]
  enumTipoConta!: typeof TipoConta
  enumCondicaoPagamento!: typeof CondicaoPagamento
  filteredCondicaoPagamento!: string[]
  enumTipoRecorrencia!: typeof TipoRecorrencia

  Object = Object


  isMobile: boolean = false;
  
  constructor(
    private observer: BreakpointObserver,
    private formBuilder: FormBuilder,
    private readonly accountService: AccountService,
    private readonly transationService: TransationService,
    private readonly categoryService: CategoryService,
    private readonly creditCardService: CreditCardService,
    private readonly memberService: FamilyMembersService,
    private alertService: AlertModalService,
    private readonly authService: AuthService,

    ){

      this.enumTipoConta = TipoConta;
      this.enumCondicaoPagamento = CondicaoPagamento;
      this.enumFormaPagamento = FormaPagamento;
      this.enumTipoRecorrencia = TipoRecorrencia
      this.filteredformaPagamento = Object.values(this.enumFormaPagamento).filter(item => item !== 'Crédito');
      this.filteredCondicaoPagamento = Object.values(this.enumCondicaoPagamento).filter(item => item !== 'Parcelado');


  }

  ngOnInit(): void {

    this.nameUser = this.authService.GetUser().name || 'null'

    this.observer.observe(['(max-width: 1024px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

    // this.buildFormTransfer();
    // this.buildFomrIncomeExpense()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private buildFormTransfer(): void {
    this.resourceFormTransfer = this.formBuilder.group({
      valor: [null, [Validators.required]],
      descricao: [null,  [Validators.maxLength(30)]],
      id_conta_atual: [null, [Validators.required]],
      id_conta_transferencia: [null, [Validators.required]],
    });

  }

  private buildFomrIncomeExpense(): void {
    let date = new Date().toISOString();
    let data_pagamento = new Date().toISOString().split('T')[0]; 
    this.resourceFormIncomeExpense = this.formBuilder.group({
      valor: [null, [Validators.required]],
      descricao: [null,  [Validators.maxLength(30)]],
      id_categoria: [null, [Validators.required]],
      id_financeiro: [null, [Validators.required]],
      condicao_pagamento: [this.enumCondicaoPagamento.AVISTA, [Validators.required]],
      tipo_recorrencia: [this.enumTipoRecorrencia.MENSAL, [Validators.required]],
      datatime: [date, [Validators.required]],
      data_pagamento: [data_pagamento, [Validators.required]],
      consolidado: [false, [Validators.required]],
      forma_pagamento: [null, [Validators.required]],
      quantidade_parcelas: [1, [Validators.max(48)]],
      quantity_member: ['Somente eu'],
      divide_parente: this.formBuilder.array([])

    },{validators: divideParentValidator()});


  }


  get divideMember(): FormArray {
    return this.resourceFormIncomeExpense.get('divide_parente') as FormArray;
  }

  createDivideMember(memberId: number | null, value: number): FormGroup{
    return this.formBuilder.group({
      id_parente: [memberId, Validators.required],
      valor_parente: [value, Validators.required],
    });
  }

  ///////////////////// functions subscribe  /////////////////////

  getAccount(){
    this.accountService.getAll(true)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Account[]) =>{
        console.log("data", data)
        this.account = data;
        this.accountDebito = data.filter(item => item.tipo_conta !== this.enumTipoConta.CARTEIRA)
        this.accountDinheiro = data.filter (item => item.tipo_conta === this.enumTipoConta.CARTEIRA)
      }, 
      error:(error: HttpErrorResponse) => {
        console.log(error)
      }
    })
  }

  getCreditCard(){
    this.creditCardService.getAll(true)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: CreditCard[]) =>{
        console.log("credit card", data)
        this.creditCard = data;
      }, 
      error:(error: HttpErrorResponse) => {
        console.log(error)
      }
    })
  }

  getMember(){
    this.memberService.getAll(true)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: FamilyMembers[]) =>{
        console.log("member", data)
        this.member = data;

        const length = this.member.length<=6 ? this.member.length : 6
        for (let i = 1; i <= length; i++) {
          this.quantityMember.push(i.toString());
        }
      }, 
      error:(error: HttpErrorResponse) => {
        console.log(error)
      }
    })
  }


  getCategoryExpense(){
    this.categoryService.getAllExpense(true)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(data: Category[]) =>{
        this.categoryExpense = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error)
      }
    })
  }

  getCategoryIncome(){
    this.categoryService.getAllIncome(true)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(data: Category[]) =>{
        this.categoryIncome = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error)
      }
    })
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



  ///////////////////// modals /////////////////////

  async openIncome(){
    this.openModalIncome = true;
    this.openModalExpense = false;
    this.openModalTransfer = false;

    this.selectedPaymentName = null;
    this.selectedPaymentIcon = null;
    this.selectedCategoryName = null;
    this.selectedCategoryIcon = null;

    this.buildFomrIncomeExpense()


    this.modalConfig = {
      modalTitle: 'Criar nova receita'
    }

    if(this.categoryIncome.length == 0){
      this.getCategoryIncome()
    }

    if(this.account.length == 0)
      this.getAccount();


    if(this.member.length == 0)
      this.getMember()
   

    await this.modalDefault.openDefault()

    
  }

  async openExpense(){

    this.openModalIncome = false;
    this.openModalExpense = true;
    this.openModalTransfer = false;

    this.selectedPaymentName = null;
    this.selectedPaymentIcon = null;
    this.selectedCategoryName = null;
    this.selectedCategoryIcon = null;

    this.buildFomrIncomeExpense()

    this.modalConfig = {
      modalTitle: 'Criar nova despesa'
    }

   
    if(this.categoryExpense.length == 0){
      this.getCategoryExpense()
    }

    if(this.account.length == 0)
      this.getAccount()


    if(this.creditCard.length == 0)
      this.getCreditCard()

    if(this.member.length == 0)
      this.getMember()


    await this.modalDefault.openDefault();

  }

  async openTransfer(){

    this.openModalIncome = false;
    this.openModalExpense = false;
    this.openModalTransfer = true;

    this.selectedAccontCurrentIcon = null;
    this.selectedAccontCurrentName = null;
    this.selectedAccontTransferIcon = null;
    this.selectedAccontTransferName = null;

    this.buildFormTransfer()

    this.modalConfig = {
      modalTitle: 'Criar nova transferência'
    }

    if(this.account.length == 0)
      this.getAccount()

    await this.modalDefault.openDefault()

    
  }


  ///////////////////// Functions Modals /////////////////////

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

  toggleDropdownAccountCurrent(){
    this.dropdownOpenAccountCurrent= !this.dropdownOpenAccountCurrent;

  }

  toggleDropdownAccountTransfer(){
    this.dropdownOpenAccountTransfer= !this.dropdownOpenAccountTransfer;

  }


  selectCategory(category: Category) {
    this.selectedCategoryName = category.nome;
    this.selectedCategoryIcon = category.nome_icone;
    this.resourceFormIncomeExpense.get('id_categoria')?.setValue(category.id_categoria)
    this.dropdownOpenCategory = false;
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


  selectAccountCurrent(resource: Account){
    this.selectedAccontCurrentName = resource.nome;
    this.selectedAccontCurrentIcon = resource.nome_icone;
    this.resourceFormTransfer.get('id_conta_atual')?.setValue(resource.id_conta)
    this.dropdownOpenAccountCurrent = false;
  }

  selectAccountTransfer(resource: Account){
    this.selectedAccontTransferName = resource.nome;
    this.selectedAccontTransferIcon = resource.nome_icone;
    this.resourceFormTransfer.get('id_conta_transferencia')?.setValue(resource.id_conta)
    this.dropdownOpenAccountTransfer = false;
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
}
