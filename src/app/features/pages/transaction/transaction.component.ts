import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/shared/services/account.service';
import { Account } from '../account/shared/models/account.model';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormaPagamento, TipoConta, TipoMovimentacao } from '../../../shared/models/enum.model';


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

  resourceFormTransfer!: FormGroup;

  account: Account [] = [];
  accountDebito: Account[] = []
  accountDinheiro: Account[] = []


  enumMovimentacao!: typeof TipoMovimentacao
  enumFormaPagamento!: typeof FormaPagamento
  enumTipoConta!: typeof TipoConta


  isMobile: boolean = false;
 
  constructor(
    private observer: BreakpointObserver,
    protected formBuilder: FormBuilder,
    protected accountService: AccountService


    ){

      this.enumTipoConta = TipoConta;

  }

  ngOnInit(): void {
    this.observer.observe(['(max-width: 1024px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

    this.buildFormTransfer();


  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected buildFormTransfer(): void {
    this.resourceFormTransfer = this.formBuilder.group({
      valor: [null, [Validators.required]],
      descricao: [null],
      id_conta_atual: [null, [Validators.required]],
      id_conta_transferencia: [null, [Validators.required]],
    });
  }

  getAccount(){
    this.accountService.getAll(true)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: Account[]) =>{
        this.account = data;
        this.accountDebito = data.filter(item => item.tipo_conta !== this.enumTipoConta.CARTEIRA)
        this.accountDinheiro = data.filter (item => item.tipo_conta === this.enumTipoConta.CARTEIRA)
      }, 
      error:(error: HttpErrorResponse) => {

      }
    })
  }


  async openIncome(){
    this.openModalIncome = true;
    this.openModalExpense = false;
    this.openModalTransfer = false;

    this.modalConfig = {
      modalTitle: 'Criar nova receita'
    }
    await this.modalDefault.openDefault()
  }

  async openExpense(){

    this.openModalIncome = false;
    this.openModalExpense = true;
    this.openModalTransfer = false;

    this.modalConfig = {
      modalTitle: 'Criar nova despesa'
    }
    await this.modalDefault.openDefault()
  }

  async openTransfer(){

    this.openModalIncome = false;
    this.openModalExpense = false;
    this.openModalTransfer = true;

    this.modalConfig = {
      modalTitle: 'Criar nova transferência'
    }
    await this.modalDefault.openDefault()
  }

  addTransationTransfer(){

  }
}
