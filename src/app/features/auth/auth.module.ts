import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoginComponent } from './login/login.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { SendRecoverComponent } from './send-recover/send-recover.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, ResetPassComponent, SendRecoverComponent],
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
