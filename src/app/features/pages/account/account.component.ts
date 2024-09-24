import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './shared/services/account.service';
import { Subject, takeUntil } from 'rxjs';
import { Account } from './shared/models/account.model';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageAccountService } from 'src/app/shared/services/image-account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  modalConfig! : ModalConfig;
  @ViewChild('modal_default') protected modalDefault!: ModalComponent;

  private ngUnsubscribe = new Subject<void>();
  account: Account[] = [];
  resourceForm!: FormGroup;
  images: string[] = [];

  openModalAdd: boolean = false;

  tipoConta: string[] = [
    "Corrente",
    "Poupança",
    "Conta de pagamento",
    "Carteira",
    "Conta Salário"
  ]

  constructor(
    private readonly accountService: AccountService,
    protected formBuilder: FormBuilder,
    private imageListService: ImageAccountService

     ){
  }
  ngOnInit(): void {
    this.images = this.imageListService.getImages();

    this.getAccount();
    this.buildForm();

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected getAccount(){
    this.accountService.getAccount()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data)=>{
        console.log("data", data)
        this.account = data;
      }
    })
  }

  protected async openAddModal(){
    this.openModalAdd = true;

    this.modalConfig = {
      modalTitle: `Adicionar conta`
    }

    await this.modalDefault.openDefault();
  }

  buildForm(){
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required]],
      descricao: [null, Validators.maxLength(100)],
      tipo_conta: [null, [Validators.required]],
      nome_icone: [null, [Validators.required]],
      ativo: [true],

    });
  }
}
