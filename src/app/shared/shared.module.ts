import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from './components/modal/modal.component';
import { FormatPricePipe, FormatPricePipeInt } from './pipes/format-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatDayDate } from './pipes/format-data';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FirstTwoWordsPipe } from './pipes/format-name.pipe';



@NgModule({
  declarations: [
    FormFieldErrorComponent,
    AlertModalComponent,
    ModalComponent,
    FormatPricePipeInt,
    FormatPricePipe,
    FormatDayDate,
    FirstTwoWordsPipe,
    TransactionListComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    TooltipModule.forRoot(),
    MatIconModule

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
    ReactiveFormsModule,
    TransactionListComponent,
    FirstTwoWordsPipe,



  ],
  providers: [DatePipe]
})
export class SharedModule { }
