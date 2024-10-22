import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from './components/modal/modal.component';
import { FormatPricePipe, FormatPricePipeInt } from './pipes/format-pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatDayDate } from './pipes/format-data';



@NgModule({
  declarations: [
    FormFieldErrorComponent,
    AlertModalComponent,
    ModalComponent,
    FormatPricePipeInt,
    FormatPricePipe,
    FormatDayDate
  ],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [
    CommonModule,
    FormFieldErrorComponent,
    AlertModalComponent,
    ModalModule,
    MatIconModule,
    ModalComponent,
    FormatPricePipeInt,
    FormatPricePipe,
    FormatDayDate,
    ReactiveFormsModule


  ]
})
export class SharedModule { }
