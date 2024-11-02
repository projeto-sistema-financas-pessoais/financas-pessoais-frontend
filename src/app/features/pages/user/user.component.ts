import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  data_nascimento: string | null = null;
  userForm!: FormGroup;
  user!: User

  @ViewChild('modal_small') protected modalSmall!: ModalComponent;

  deleteItem!: User['email'];
  openModalDelete: boolean = false;

  constructor(
    protected readonly userService: UserService,
    protected readonly authService: AuthService,
    injector : Injector,
    private router: Router,
    private datePipe: DatePipe 
     ){
  
    super(injector, new User({}), 'usuario', 'Usuário', userService);
    this.user = new User({})
  }

 override ngOnInit(): void {

    this.user.nome_completo = this.authService.GetUser().name || 'null'
    this.user.email = this.authService.GetUser().email || 'null'

    const userData = this.authService.GetUser();
    const date = userData.date_user ? new Date(userData.date_user) : null;
    this.data_nascimento = date ? this.datePipe.transform(date, 'dd/MM/yyyy') : null;

    this.buildForm();
  }

  protected buildForm(){
    this.resourceForm = this.formBuilder.group({
      nome_completo: [this.user.nome_completo, [Validators.required, Validators.minLength(3)]],
      data_nascimento: [this.data_nascimento, [Validators.required]],
    });
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

  protected deleteResourceUser(email: string){
    this.userService.deleteResourceUser(email)
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

}