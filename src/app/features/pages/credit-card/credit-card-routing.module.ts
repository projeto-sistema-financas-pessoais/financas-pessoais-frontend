import { NgModule } from '@angular/core';
import { CreditCardComponent } from './credit-card.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: CreditCardComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCardRoutingModule { }
