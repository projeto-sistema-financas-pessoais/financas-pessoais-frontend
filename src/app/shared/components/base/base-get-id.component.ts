import { Directive, Injector, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { BaseModel } from "../../models/base/base-model.model";
import { BaseFormService } from "../../services/base/base-form.service";
import { ActivatedRoute } from "@angular/router";

@Directive()
export abstract class BaseGetIdComponent<T extends BaseModel> implements OnInit, OnDestroy{

    protected ngUnsubscribe = new Subject<void>();

    protected route: ActivatedRoute;

    resourceData!: T
  
    id!: number;
    constructor(
      public injector: Injector,
      public resource: T,
      protected baseService: BaseFormService<T>,
  
    ){
        this.route = this.injector.get(ActivatedRoute)
    }
  
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          this.id = Number(params.get('id'));
  
          this.getById()
      })  
    }
  
    getById(){
      this.baseService.getById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data: T) => {
            console.log("data", data)
          this.resourceData = data;
        }
      })
    }
  
    ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
}  