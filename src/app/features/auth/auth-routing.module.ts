import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { SendRecoverComponent } from './send-recover/send-recover.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'cadastro', component: RegisterComponent},
  { path: 'redefinir-senha/:token', component: ResetPassComponent },
  { path: 'recuperar-senha', component: SendRecoverComponent },


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
