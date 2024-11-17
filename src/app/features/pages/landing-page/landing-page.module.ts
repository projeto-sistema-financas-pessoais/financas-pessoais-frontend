import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { MonthlyBudgetVsActualComponent } from './shared/components/monthly-budget-vs-actual/monthly-budget-vs-actual.component';
import { EconomyComponent } from './shared/components/economy/economy.component';
import { IncomeExpenseComponent } from './shared/components/income-expense/income-expense.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { OverdueModule } from './shared/components/overdue/overdue.module';
import { FinanceComponent } from './shared/components/finance/finance.component';
import { CreditFinanceComponent } from './shared/components/credit-finance/credit-finance.component';


@NgModule({
  declarations: [
    LandingPageComponent,
    MonthlyBudgetVsActualComponent,
    EconomyComponent,
    IncomeExpenseComponent,
    FinanceComponent,
    CreditFinanceComponent
  ],
  imports: [
    SharedModule,
    LandingPageRoutingModule,
    NgApexchartsModule,
    MatButtonToggleModule,
    FormsModule,
    OverdueModule

  ]
})
export class LandingPageModule { }
