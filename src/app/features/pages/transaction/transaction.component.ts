import { Component, OnInit, ViewChild } from '@angular/core';
import { TransationService } from '../transaction/shared/services/transation.service';
import { TransationFilter, TransationList } from './shared/models/transation-list.model';
import { Subject, takeUntil } from 'rxjs';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from './shared/models/transation-enum.model';
import { CategoryService } from '../user/shared/models/services/category.service';
import { Category } from '../user/shared/models/category.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionsComponent implements OnInit{

  // protected ngUnsubscribe = new Subject<void>();
  modalConfig! : ModalConfig;
  @ViewChild('modal_default') protected modalDefault!: ModalComponent;
 
  constructor(
    ){
  }

  ngOnInit(): void {
 
  }


}
