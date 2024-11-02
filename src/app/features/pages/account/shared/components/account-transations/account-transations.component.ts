import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { Subject, takeUntil } from 'rxjs';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';

@Component({
  selector: 'app-account-transations',
  templateUrl: './account-transations.component.html',
  styleUrls: ['./account-transations.component.scss']
})
export class AccountTransationsComponent extends BaseGetIdComponent<Account>{


  constructor
  (  injector : Injector,
    private accountService: AccountService
  ){
    super(injector, new Account({}), accountService);
  }



}



