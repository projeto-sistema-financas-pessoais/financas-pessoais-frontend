import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './shared/services/account.service';
import { Subject, takeUntil } from 'rxjs';
import { Account } from './shared/models/account.model';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icon, ImageAccountService } from 'src/app/shared/services/image-account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';

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
  images: Icon[] = [];

  openModalAdd: boolean = false;
  openModalEdit: boolean = false;
  openMenuGallery: boolean = false;
  idEdit: number = -1;

  imageSelected!: string;

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
    private imageListService: ImageAccountService,
    private alertService: AlertModalService

     ){
  }
  ngOnInit(): void {
    this.images = this.imageListService.getImages();
    this.imageSelected = this.images[0].fileName;

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
      modalTitle: `Adicionar conta`,
      canReturn: false

    }

    await this.modalDefault.openDefault();
  }


  protected async openEditAccount(item: Account){
    this.openModalAdd = false;
    this.openModalEdit = true;
    this.openMenuGallery = false;
    this.idEdit = item.id_conta;

    this.modalConfig = {
      modalTitle: `Editar conta`,
      canReturn: false
    }
    this.loadForm(item);
    await this.modalDefault.openDefault();
  }

  private buildForm(){
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required]],
      descricao: [null, Validators.maxLength(100)],
      tipo_conta: [null, [Validators.required]],
      nome_icone: [this.imageSelected, [Validators.required]],
      ativo: [true],

    });
  }

  private loadForm(resource: Account){
    this.resourceForm.patchValue(resource);
    this.imageSelected = this.resourceForm.get('nome_icone')?.value

  }

  protected openGallery(){
    this.modalConfig = {
      modalTitle: `Selecionar Ícone`,
      canReturn: true

    }

    this.openMenuGallery = true;


  }


  protected selectedIcon(value: string){
    this.modalConfig = {
      modalTitle: `Adicionar conta`,
      canReturn: false
    }
    this.openMenuGallery = false;

    this.resourceForm.get('nome_icone')?.setValue(value)

    this.imageSelected = value
  }


  protected addAccount(){
    let resource = Object.assign({}, this.resourceForm.value);

    this.accountService.addAccount(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        console.log("criada!")
        window.location.reload()
      },
      error: (error: HttpErrorResponse) => {
        if(error.status == 406)
          this.alertService.showAlertDanger("Já existe uma conta com essse nome!")

        console.error("error ao criar conta", error, resource)

      }
    })
  }


  protected deleteAccount(id: number){
    this.accountService.deleteAccount(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        console.log("deletada!")
        window.location.reload()
      },
      error: (error) => {

        if(error.status == 400)
          this.alertService.showAlertWarning(
        "A exclusão desta conta não é permitida, pois existem movimentações associadas a ela");
        console.error("error ao deletar conta", error)

      }
    })
  }

  protected deactivateAccount(active: boolean, id: number){
    let resource = new Account({})
    resource.ativo = !active;
    resource.id_conta = id;
    this.editAccount(resource);
  }

  protected editAllAccount(){
    let resource: Account = Object.assign({}, this.resourceForm.value);
    resource.id_conta = this.idEdit;
    this.editAccount(resource)
  }

  protected editAccount(resource: any){
    this.accountService.editAccount(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response) =>{
        console.log("editou!", response)
        window.location.reload()
      },
      error: (error) => {
        if(error.status == 406)
          this.alertService.showAlertDanger("Já existe uma conta com essse nome!")
        console.error("error ao editar a  conta", error, resource)

      }
    })
  }



}
