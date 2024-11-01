import { Directive, Injector, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { Icon, ImageAccountService } from "../../services/image-account.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertModalService } from "../../services/alert-modal.service";
import { BaseFormService } from "../../services/base/base-form.service";
import { ModalConfig } from "../../models/moda-config.model";
import { ModalComponent } from "../modal/modal.component";
import { BaseModel } from "../../models/base/base-model.model";
import { HttpErrorResponse } from "@angular/common/http";

@Directive()
export abstract class BaseFormComponent<T extends BaseModel> implements OnInit, OnDestroy{

  protected ngUnsubscribe = new Subject<void>();
  modalConfig! : ModalConfig;
  @ViewChild('modal_default') protected modalDefault!: ModalComponent;

  images: Icon[] = [];
  imageSelected!: string;

  idEdit: number = -1;

  resources: T[] = [];
  resourceForm!: FormGroup;

  openModalAdd: boolean = false;
  openModalEdit: boolean = false;
  openMenuGallery: boolean = false;

  protected formBuilder: FormBuilder;
  protected imageListService: ImageAccountService;
  protected alertService: AlertModalService;


  constructor(
    public injector: Injector,
    public resource: T,
    public nameId: string,
    public nameComplete: string,
    protected baseService: BaseFormService<T>,

  ){
    this.formBuilder = this.injector.get(FormBuilder)
    this.imageListService = this.injector.get(ImageAccountService)
    this.alertService = this.injector.get(AlertModalService)
  }

  ngOnInit(): void {
    this.images = this.imageListService.getImages();
    this.imageSelected = this.images[0].fileName;

    this.getAll(false);
    this.buildForm();

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected getAll(somenteAtivo: boolean){
    this.baseService.getAll(somenteAtivo)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data)=>{
        console.log("data", data)
        this.resources = data;
      },
      error: (error) => {
        console.log("error to get all", error)
      }
    })
  }

  protected async openAddModal(){
    this.openModalAdd = true;
    this.openMenuGallery = false;
    this.buildForm()
    this.imageSelected = this.images[0].fileName;


    this.modalConfig = {
      modalTitle: `Adicionar ${this.nameComplete}`,
      canReturn: false

    }

    await this.modalDefault.openDefault();
  }

  protected async openEdit(item: T){
    this.openModalAdd = false;
    this.openModalEdit = true;
    this.openMenuGallery = false;
    this.idEdit = item[`id_${this.nameId}`]; 

    this.modalConfig = {
      modalTitle: `Editar ${this.nameComplete}`,
      canReturn: false
    }
    this.buildForm()

    this.loadForm(item);
    await this.modalDefault.openDefault();
  }

  private loadForm(resource: T){
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


  protected selectedIcon(value: string, ){
    this.modalConfig = {
      modalTitle: `Adicionar ${this.nameComplete}`,
      canReturn: false
    }
    this.openMenuGallery = false;

    this.resourceForm.get('nome_icone')?.setValue(value)

    this.imageSelected = value
  }


  protected addResource(){
    let resource = Object.assign({}, this.resourceForm.value);

    this.baseService.addResource(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        console.log("criada!")
        window.location.reload()
      },
      error: (error: HttpErrorResponse) => {
        if(error.status == 406)
          this.alertService.showAlertDanger(`Já existe um registro com esse nome. Por favor, escolha um nome diferente!"`)

        if(error.status == 400)
          this.alertService.showAlertDanger(`O dia do vencimento da fatura não pode ser maior que o dia do fechamento"`)

        console.error(`error ao criar ${this.nameComplete}`, error, resource)

      }
    })
  }


  protected deleteResource(id: number){
    this.baseService.deleteResource(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        console.log("deletada!")
        window.location.reload()
      },
      error: (error) => {

        if(error.status == 400)
          this.alertService.showAlertWarning(
        "A exclusão não é permitida, pois existem movimentações associadas");
        console.error(`error ao deletar ${this.nameComplete}`, error)

      }
    })
  }

  protected deleteResourceUser(email: string){
    this.baseService.deleteResourceUser(email)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        console.log("deletada!")
        window.location.reload()
      },
      error: (error) => {

        if(error.status == 400)
          this.alertService.showAlertWarning(
        "A exclusão não é permitida, pois existem movimentações associadas");
        console.error(`error ao deletar ${this.nameComplete}`, error)

      }
    })
  }


  protected deactivateResource(active: boolean, id: number){
    let resource: any = this.resource
    resource.ativo = !active;
    resource[`id_${this.nameId}`] = id;
    this.editResource(resource);
  }


  protected editResource(resource: any){
    this.baseService.editResource(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response) =>{
        console.log("editou!", response, "resource", resource)
        window.location.reload()
      },
      error: (error) => {
        if(error.status == 406)
            this.alertService.showAlertDanger(`Já existe um registro com esse nome. Por favor, escolha um nome diferente!"`)
        console.error("error ao editar a  conta", error, resource)

      }
    })
  }


  protected editAllAccount(){
    let resource: any = Object.assign({}, this.resourceForm.value);
    resource[`id_${this.nameId}`]  = this.idEdit;
    this.editResource(resource)
  }
  protected abstract buildForm(): void;

}