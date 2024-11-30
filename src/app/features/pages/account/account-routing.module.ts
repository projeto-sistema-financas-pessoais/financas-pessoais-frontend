import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountTransationsComponent } from './shared/components/account-transations/account-transations.component';

const routes: Routes = [
  { path: '', component: AccountComponent,
  },
  { path: 'movimentacoes-conta/:id', component: AccountTransationsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
