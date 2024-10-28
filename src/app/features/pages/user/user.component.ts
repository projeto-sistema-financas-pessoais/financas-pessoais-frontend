import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './shared/services/user.service'
import { AuthService } from '../../auth/shared/services/auth.service';
import { User } from './shared/models/user.model'
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [DatePipe] 

})
export class UserComponent  extends BaseFormComponent<User>{

  userForm!: FormGroup;
  user!: User

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

    this.buildForm();

    this.user.nome_completo = this.authService.GetUser().name || 'null'
    this.user.email = this.authService.GetUser().email || 'null'
    this.user.data_nascimento = new Date(this.authService.GetUser().date_user || 'null');
    const formattedDate = this.datePipe.transform(this.user.data_nascimento, 'yyyy-MM-dd');
    this.resourceForm.get('data_nascimento')?.setValue(formattedDate);
    
  }

  protected buildForm(){
    this.resourceForm = this.formBuilder.group({
      nome_completo: [null, [Validators.required, Validators.minLength(3)]],
      data_nascimento: [null, [Validators.required]],
    });
  }

  navigateToPage() {
    this.router.navigate(['/configuracoes-de-usuario/categorias']);
  }

  
}