import { Component, Injector } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { CreditCard } from '../../credit-card/shared/models/credit-card.model';
import { CategoryService } from '../shared/models/services/category.service';
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
 
  income: boolean = true;
  icons: IconCategory[] = [];

  tipoCategoria: string[] = [
    "Fixa",
    "Variável",
  ]


  modeloCategoria: string[] = [
    "Receita",
    "Despesa",
  ]

  constructor(
    protected readonly categoryService: CategoryService,
    protected imageIconCategoryService: ImageIconCategoryService,
    injector : Injector,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location


     ){
    super(injector, new Category({}), 'categoria', 'Categoria', categoryService);
  }

  protected override buildForm(): void {
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.maxLength(20)]],
      tipo_categoria: ["", [Validators.required]],
      modelo_categoria: ["", [Validators.required]],
      nome_icone: [this.imageSelected, [Validators.required]],
      valor_categoria: [null]

    });
  }

  override ngOnInit(): void {
    this.icons = this.imageIconCategoryService.getImages();
    this.imageSelected = this.icons[0].fileName;

    this.route.queryParams.subscribe(params => {
      if (params['value']) {
        params['value'] == "Receita" ?  this.income = true : this.income = false;
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
  

  protected getAllIncome(){
    this.categoryService.getAllIncome()
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
    this.categoryService.getAllExpense()
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
 

}
