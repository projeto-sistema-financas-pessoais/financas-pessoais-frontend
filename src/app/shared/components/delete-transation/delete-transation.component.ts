import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';

@Component({
  selector: 'app-delete-transation',
  templateUrl: './delete-transation.component.html',
  styles: [`@import'src/styles.scss';`]
})
export class DeleteTransationComponent {

  constructor() { }
  @Output() dismiss: EventEmitter<any> = new EventEmitter;
  @Output() delete: EventEmitter<any> = new EventEmitter;


  @Input() deleteItem!: TransactionList

}
