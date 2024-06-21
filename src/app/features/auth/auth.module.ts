import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  imports: [
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    BsDatepickerModule.forRoot(),

  ],
  exports:[RegisterComponent],
  providers: [provideNgxMask()]
})
export class AuthModule { }
