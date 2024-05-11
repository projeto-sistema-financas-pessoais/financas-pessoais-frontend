import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    FormFieldErrorComponent,
    AlertModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [
    CommonModule,
    FormFieldErrorComponent,
    AlertModalComponent,
    ModalModule

  ]
})
export class SharedModule { }
