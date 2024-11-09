import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyBudgetVsActualComponent } from './monthly-budget-vs-actual.component';

describe('MonthlyBudgetVsActualComponent', () => {
  let component: MonthlyBudgetVsActualComponent;
  let fixture: ComponentFixture<MonthlyBudgetVsActualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyBudgetVsActualComponent]
    });
    fixture = TestBed.createComponent(MonthlyBudgetVsActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
