import { Directive, Injector, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { TransationService } from "src/app/features/pages/transaction/shared/services/transation.service";
import { AlertModalService } from "../../services/alert-modal.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TransactionList } from "src/app/features/pages/transaction/shared/models/transation-list.model";
import { TransationConsolidated } from "src/app/features/pages/transaction/shared/models/transation.model";
import { TipoMovimentacao, FormaPagamento, CondicaoPagamento, TipoConta, TipoRecorrencia } from "../../models/enum.model";
import { ModalConfig } from "../../models/moda-config.model";
import { ModalComponent } from "../modal/modal.component";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoryService } from "src/app/features/pages/user/shared/services/category.service";
import { Category } from "src/app/features/pages/user/shared/models/category.model";
import { Account } from "src/app/features/pages/account/shared/models/account.model";
import { AccountService } from "src/app/features/pages/account/shared/services/account.service";
import { FamilyMembers } from "src/app/features/pages/family-members/shared/models/family-members.model";
import { FamilyMembersService } from "src/app/features/pages/family-members/shared/services/family-members.service";
import { CreditCardService } from "src/app/features/pages/credit-card/shared/services/credit-card.service";
import { CreditCard } from "src/app/features/pages/credit-card/shared/models/credit-card.model";
import { divideParentValidator } from "../../services/validatior.service";
import { AuthService } from "src/app/features/auth/shared/services/auth.service";


@Directive()
export abstract class BaseTransationComponent implements  OnDestroy{

    protected ngUnsubscribe = new Subject<void>();
    @ViewChild('modal_small') protected modalSmall!: ModalComponent;
    @ViewChild('modal_default') protected modalDefault!: ModalComponent;

    modalConfig! : ModalConfig;
    
    enumMovimentacao!: typeof TipoMovimentacao
    enumFormaPagamento!: typeof FormaPagamento
    enumCondicaoPagamento!: typeof CondicaoPagamento
    openModalDelete: boolean = false;
    deleteItem!: TransactionList;
    openModalCantEdit: boolean = false;

    resourceFormTransfer!: FormGroup;
    resourceFormIncomeExpense!: FormGroup;


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

    openModalTransfer: boolean = false;
    openModalIncome: boolean = false;
    openModalExpense: boolean = false;

    categoryIncome: Category[] = [];
    categoryExpense: Category[] = [];


    account: Account [] = [];
    accountDebito: Account[] = []
    accountDinheiro: Account[] = []
    member: FamilyMembers[] = []

    enumTipoConta!: typeof TipoConta
    enumTipoRecorrencia!: typeof TipoRecorrencia;

    creditCard: CreditCard [] = [];


    edit: number | null = null;

    quantityMember = [
      "Somente eu"
    ]

    selectedItemEdit!: TransactionList


    protected readonly transationService: TransationService
    protected readonly alertService: AlertModalService
    protected readonly categoryService: CategoryService 
    protected readonly accountService: AccountService
    protected readonly memberService: FamilyMembersService
    protected readonly creditCardService: CreditCardService
    protected readonly formBuilder: FormBuilder
    protected readonly authService: AuthService


    // resourceData!: T
  
    id!: number;

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    constructor(
        public injector: Injector,
        )
     {
        this.enumMovimentacao = TipoMovimentacao;
        this.enumFormaPagamento = FormaPagamento;
        this.enumTipoConta = TipoConta;
        this.enumCondicaoPagamento = CondicaoPagamento;
        this.enumTipoRecorrencia = TipoRecorrencia;
        
        this.transationService = this.injector.get(TransationService)
        this.alertService = this.injector.get(AlertModalService)
        this.categoryService = this.injector.get(CategoryService)
        this.accountService = this.injector.get(AccountService)
        this.memberService = this.injector.get(FamilyMembersService)
        this.creditCardService = this.injector.get(CreditCardService)
        this.formBuilder = this.injector.get(FormBuilder)
        this.authService = this.injector.get(AuthService)


    }
  
  
    changeConsolidated(item: TransactionList, type : string){

        item.consolidado = !item.consolidado;
    
        let consolidated: TransationConsolidated = {
          id_movimentacao: item.id_movimentacao,
          consolidado: item.consolidado
        }
        this.transationService.consolidatedTransation(consolidated)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (data: any) =>{
    
            this.alertService.showAlertSuccess(
              item.consolidado ? 'Sucesso ao consolidar movimentação!' : 'Sucesso ao não consolidar movimentação!'
            
            )
    
            if(type == 'account'  || type == 'member' || type=='overdue'){
              setTimeout(() =>{
                window.location.reload();
              }, 500)
            }
            
            console.log("delete transation success", data)
          },
          error: (error: HttpErrorResponse) =>{
            console.log('error delete transation', error)
          }
        })
      }
    
    protected openDelete(item: TransactionList){

      this.openModalDelete = true;
      this.openModalCantEdit = false;
  
      this.deleteItem = item;
      this.modalConfig = {
        modalTitle: 'Excluir movimentação'
      }
  
      this.modalSmall.openSmall();
    }
  


  deleteTransation(){
    this.transationService.deleteTransation(this.deleteItem.id_movimentacao)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: any) =>{

        this.alertService.showAlertSuccess("Sucesso ao deletar!")

        setTimeout(() =>{
          window.location.reload();
        }, 800)
        
        console.log("delete transation success", data)
      },
      error: (error: HttpErrorResponse) =>{
        console.log('error delete transation', error)
      }
    })
  }

  openEdit(item: TransactionList){

    this.edit = item.id_movimentacao;
    this.modalConfig = {
      modalTitle: 'Editar movimentação'
    }

    this.selectedItemEdit = item;

    console.log("selected item", this.selectedItemEdit)

    if((item.consolidado && item.id_fatura !== null) || item.tipoMovimentacao == this.enumMovimentacao.FATURA){
      this.openModalCantEdit = true;
      this.openModalDelete = false;
      this.modalSmall.openSmall();

      
    }
    else if(item.tipoMovimentacao == this.enumMovimentacao.RECEITA){
      this.openIncome(true)
      this.patchIncomeExpense()      

    }
    else if(item.tipoMovimentacao == this.enumMovimentacao.DESPESA){
      this.openExpense(true)
      this.patchIncomeExpense()      
    }
    else if(item.tipoMovimentacao == this.enumMovimentacao.TRANSFERENCIA){
      this.openTransfer(true)
      this.resourceFormTransfer.patchValue(this.selectedItemEdit)
      this.resourceFormTransfer.get('id_conta_atual')?.setValue(this.selectedItemEdit.id_conta)
      this.resourceFormTransfer.get('id_conta_transferencia')?.setValue(this.selectedItemEdit.id_conta_destino)

    }



  }

  patchIncomeExpense(){
    let nameUser = this.authService.GetUser().name || 'null'

    this.resourceFormIncomeExpense.patchValue(this.selectedItemEdit)
    if(this.selectedItemEdit.forma_pagamento == this.enumFormaPagamento.CREDITO){
      this.resourceFormIncomeExpense.get('id_financeiro')?.setValue(this.selectedItemEdit.id_cartao_credito)
    }else {
      this.resourceFormIncomeExpense.get('id_financeiro')?.setValue(this.selectedItemEdit.id_conta)
    }


    if(this.selectedItemEdit.divide_parente.length > 1 || this.selectedItemEdit.divide_parente[0].nome_parente !== nameUser){
      this.resourceFormIncomeExpense.get('quantity_member')?.setValue(this.selectedItemEdit.divide_parente.length)

      this.selectedItemEdit.divide_parente.forEach(item => {
        this.divideMember.push(this.createDivideMember(item.id_parente, item.valor_parente));

      })

    }
  }

  createDivideMember(memberId: number | null, value: number): FormGroup{
    return this.formBuilder.group({
      id_parente: [memberId, Validators.required],
      valor_parente: [value, Validators.required],
    });
  }
  


  protected buildFormTransfer(): void {
    this.resourceFormTransfer = this.formBuilder.group({
      valor: [null, [Validators.required]],
      descricao: [null,  [Validators.maxLength(30)]],
      id_conta_atual: [null, [Validators.required]],
      id_conta_transferencia: [null, [Validators.required]],
    });

  }

  protected buildFomrIncomeExpense(): void {
    let date = new Date().toISOString();
    let data_pagamento = new Date().toLocaleDateString('en-CA')
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


  async openIncome(edit?:boolean){
    this.openModalIncome = true;
    this.openModalExpense = false;
    this.openModalTransfer = false;

    this.selectedPaymentName = null;
    this.selectedPaymentIcon = null;
    this.selectedCategoryName = null;
    this.selectedCategoryIcon = null;

    this.edit = edit ? this.selectedItemEdit.id_movimentacao : null;

    this.buildFomrIncomeExpense()


    this.modalConfig = {
      modalTitle:  edit ? 'Editar receita' : 'Criar nova receita'
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

  async openExpense(edit?: boolean){

    this.openModalIncome = false;
    this.openModalExpense = true;
    this.openModalTransfer = false;

    this.selectedPaymentName = null;
    this.selectedPaymentIcon = null;
    this.selectedCategoryName = null;
    this.selectedCategoryIcon = null;
    this.edit = edit ? this.selectedItemEdit.id_movimentacao : null;

    this.buildFomrIncomeExpense()

    this.modalConfig = {
      modalTitle: edit? 'Editar despesa': 'Criar nova despesa'
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

  async openTransfer(edit?: boolean){

    this.openModalIncome = false;
    this.openModalExpense = false;
    this.openModalTransfer = true;

    this.selectedAccontCurrentIcon = null;
    this.selectedAccontCurrentName = null;
    this.selectedAccontTransferIcon = null;
    this.selectedAccontTransferName = null;
    this.edit = edit ? this.selectedItemEdit.id_movimentacao : null;

    this.buildFormTransfer()



    this.modalConfig = {
      modalTitle: edit? 'Editar transferência': 'Criar nova transferência'
    }

    if(this.account.length == 0)
      this.getAccount()

    await this.modalDefault.openDefault()

    
  }



  get divideMember(): FormArray {
    return this.resourceFormIncomeExpense.get('divide_parente') as FormArray;
  }

}  