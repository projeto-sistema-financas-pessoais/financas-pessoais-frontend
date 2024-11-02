import { NgModule } from '@angular/core';
import { CreditCardComponent } from './credit-card.component';
import { Routes, RouterModule } from '@angular/router';
import { CreditCardStatementComponent } from './shared/components/credit-card-statement/credit-card-statement.component';


const routes: Routes = [
  { path: '', component: CreditCardComponent,
  },
  { path: 'fatura-e-movimentacoes-do-cartao/:id', component: CreditCardStatementComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCardRoutingModule { }
