import { Component, Injector } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { CategoryService } from '../shared/services/category.service';
import { Validators } from '@angular/forms';
import { Category } from '../shared/models/category.model';
import { takeUntil } from 'rxjs';
import { IconCategory, ImageIconCategoryService } from 'src/app/shared/services/image-icon-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent extends BaseFormComponent<Category>{
 
  income: boolean = false;
  icons: IconCategory[] = [];

  tipoCategoria: string[] = [
    "Fixa",
    "Variável",
    "Extra",
  ]


  modeloCategoria: string[] = [
    "Receita",
    "Despesa",
  ]

  constructor(
    protected readonly categoryService: CategoryService,
    protected imageIconCategoryService: ImageIconCategoryService,
    injector : Injector,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location


     ){
    super(injector, new Category({}), 'categoria', 'Categoria', categoryService);
  }

  protected override buildForm(): void {
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.maxLength(20)]],
      tipo_categoria: ["", [Validators.required]],
      modelo_categoria: ["", [Validators.required]],
      nome_icone: [this.imageSelected, [Validators.required]],
      valor_categoria: ['']

    });
  }

  override ngOnInit(): void {
    this.icons = this.imageIconCategoryService.getImages();
    this.imageSelected = this.icons[0].fileName;

    this.route.queryParams.subscribe(params => {
      if (params['value']) {
        this.income = params['value'] === "Receita";
      }
    });

    if(this.income)
      this.getAllIncome();

    else 
      this.getAllExpense()
    
    
    this.buildForm();

  }


  changeModelCategory(model: boolean){

    if(this.income !=model){

      this.income = model;
      let queryParams: any = {value: this.income ? 'Receita': 'Despesa'};
      const url = this.router.createUrlTree(['/configuracoes-de-usuario/categorias'], { queryParams }).toString();
      this.location.go(url)
      this.location.replaceState(url)


      if(this.income){
        this.getAllIncome();
      }
        
      else 
        this.getAllExpense()

    }
    
  }
  

  protected override  async openAddModal(){
    this.openModalAdd = true;
    this.openMenuGallery = false;
    this.buildForm()
    this.imageSelected = this.icons[0].fileName;


    this.modalConfig = {
      modalTitle: `Adicionar ${this.nameComplete}`,
      canReturn: false

    }

    await this.modalDefault.openDefault();
  }

  protected getAllIncome(){
    this.categoryService.getAllIncome(false)
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

  protected getAllExpense(){
    this.categoryService.getAllExpense(false)
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

  protected deactivateResourceCategory(item: Category){
    item.ativo = !item.ativo;
    this.editResource(item);
  }

  protected override enableForm(enable: boolean): void {
    if(enable){
      this.resourceForm.get('modelo_categoria')?.enable();

    }else{
      this.resourceForm.get('modelo_categoria')?.disable();

    }
  }
 

  onKeyDownModelCategory(event: KeyboardEvent, model: boolean){
    if (event.key === 'Enter' || event.key === ' ') {
      this.changeModelCategory(model); 
      event.preventDefault(); 
    }

  }
}
