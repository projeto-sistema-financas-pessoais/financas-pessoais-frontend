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



@NgModule({
  declarations: [
    LandingPageComponent,
    MonthlyBudgetVsActualComponent,
    EconomyComponent,
    IncomeExpenseComponent,
  ],
  imports: [
    SharedModule,
    LandingPageRoutingModule,
    NgApexchartsModule,
    MatButtonToggleModule,
    FormsModule
  ]
})
export class LandingPageModule { }
