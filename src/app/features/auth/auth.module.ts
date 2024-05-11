import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask'

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  exports:[RegisterComponent],
  providers: [provideNgxMask()]
})
export class AuthModule { }
