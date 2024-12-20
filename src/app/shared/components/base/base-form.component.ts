import { AfterViewInit, Directive, Injector, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
export abstract class BaseFormComponent<T extends BaseModel> implements OnInit, OnDestroy, AfterViewInit{

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
  ngAfterViewInit(): void {
    const open = JSON.parse(localStorage.getItem('openModal')!) as string;

    if (open == 'true'){
      this.openAddModal();
    }  
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
    this.openModalEdit = false;
    this.openMenuGallery = false;
    this.buildForm();
    this.enableForm(true);

    if(this.images)
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
    this.buildForm(item)

    this.loadForm(item);
    await this.modalDefault.openDefault();
  }

  private loadForm(resource: T){
    this.resourceForm.patchValue(resource);
    this.imageSelected = this.resourceForm.get('nome_icone')?.value
    this.enableForm(false);

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
      modalTitle:  this.openModalEdit ? `Editar ${this.nameComplete}`:   `Adicionar ${this.nameComplete}`,
      canReturn: false
    }
    this.openMenuGallery = false;

    this.resourceForm.get('nome_icone')?.setValue(value)

    this.imageSelected = value
  }

  updateName(){
    if(this.openModalEdit){
      this.modalConfig.modalTitle = `Editar ${this.nameComplete}`
    }else{
      this.modalConfig.modalTitle = `Adicionar ${this.nameComplete}`

    }
  }

  protected addResource(){
    let resource = Object.assign({}, this.resourceForm.value);

    this.baseService.addResource(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        console.log("criada!")
        this.modalDefault.dismiss();
        window.location.reload()
      },
      error: (error: HttpErrorResponse) => {
        if(error.status == 406)
          this.alertService.showAlertDanger(`Já existe um registro com esse nome. Por favor, escolha um nome diferente!`)

        if(error.status == 400){
          if(this.nameComplete == "Cartão de Crédito" ){
            this.alertService.showAlertDanger(`O dia do vencimento da fatura não pode ser maior que o dia do fechamento"`)

          }else if(this.nameComplete == "Membros da Família"){
            this.alertService.showAlertDanger(`Já existe um parente com o mesmo  nome ou email. Por favor, escolha um diferente!`)

          }


        }
        
         
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
        this.alertService.showAlertSuccess("Edição feita com sucesso!")
        setTimeout( () => {
          window.location.reload()
        },500)
      },
      error: (error) => {
        if(error.status == 406)
            this.alertService.showAlertDanger(`Já existe um registro com esse nome. Por favor, escolha um nome diferente!"`)
        console.error("error ao editar a  conta", error, resource)

      }
    })
  }


  protected editAll(){
    let resource: any = Object.assign({}, this.resourceForm.value);
    resource[`id_${this.nameId}`]  = this.idEdit;
    this.editResource(resource)
  }

  onKeyPressGallery(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.openGallery();
      event.preventDefault(); // Previne o scroll ao pressionar Espaço
    }
  }

  onKeyDown(event: KeyboardEvent, fileName: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.selectedIcon(fileName);
      event.preventDefault(); // Previne o scroll ao pressionar Espaço
    }
  }
  protected abstract buildForm(item?:T): void;

  protected abstract enableForm(enable: boolean): void;

}