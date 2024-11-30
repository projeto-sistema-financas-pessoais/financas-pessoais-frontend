import { Component, Injector, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { UserService } from './shared/services/user.service'
import { AuthService } from '../../auth/shared/services/auth.service';
import { User } from './shared/models/user.model'
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import { takeUntil } from "rxjs";
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [DatePipe] 

})
export class UserComponent  extends BaseFormComponent<User>{
  
  userForm!: FormGroup;
  user!: User

  @ViewChild('modal_small') protected modalSmall!: ModalComponent;

  deleteItem!: User['email'];
  openModalDelete: boolean = false;

  constructor(
    protected readonly userService: UserService,
    protected readonly authService: AuthService,
    injector : Injector,
    private readonly router: Router,
     ){
  
    super(injector, new User({}), 'usuario', 'Usuário', userService);
    this.user = new User({})
  }

 override ngOnInit(): void {
    this.getUser()
    this.buildForm();
  }

  protected buildForm(){
    this.resourceForm = this.formBuilder.group({
      nome_completo: [this.user.nome_completo, [Validators.required, Validators.minLength(3)]],
      data_nascimento: [this.user.data_nascimento, [Validators.required]],
    });
  }

  private getUser(){
    this.userService.getUser()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: User) =>{
        this.user.nome_completo = data.nome_completo;
        this.user.data_nascimento = data.data_nascimento 

        this.user.email = this.authService.GetUser().email || 'null'
        console.log("data", data, this.user)

        this.buildForm();

      },
      error: () =>{

      }
    })
  }

  navigateToPage() {
    this.router.navigate(['/configuracoes-de-usuario/categorias']);
  }

  protected openDelete(email: User["email"]){

    this.openModalDelete = true;

    this.deleteItem = email;
    this.modalConfig = {
      modalTitle: 'Excluir perfil'
    }

    this.modalSmall.openSmall();
  }

  protected editUser(){
    let resource: any = Object.assign({}, this.resourceForm.value);

    localStorage.setItem('user_name', JSON.stringify(resource.nome_completo));


    this.userService.editUser(resource)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        this.alertService.showAlertSuccess("Sucesso ao editar usuário!")

        setTimeout( () => {
          window.location.reload()
        },800)

      },
      error: (error) => {

        if(error.status == 400)
          this.alertService.showAlertWarning(
        "A exclusão não é permitida, pois existem movimentações associadas");
        console.error(`error ao deletar ${this.nameComplete}`, error)

      }
    })
  }

  protected deleteResourceUser(){
    this.userService.deleteResourceUser()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () =>{
        this.alertService.showAlertSuccess("Sucesso ao deletar usuário! Seus dados foram excluídos.")

        setTimeout( () => {
          window.location.href= '/login';
        },1200)
      },
      error: (error) => {

        if(error.status == 400)
          this.alertService.showAlertWarning(
        "A exclusão não é permitida, pois existem movimentações associadas");
        console.error(`error ao deletar ${this.nameComplete}`, error)

      }
    })
  }

  protected override enableForm(enable: boolean): void {
  }
}