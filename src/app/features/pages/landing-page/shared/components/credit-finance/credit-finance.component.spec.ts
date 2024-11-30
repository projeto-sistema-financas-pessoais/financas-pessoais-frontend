import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditFinanceComponent } from './credit-finance.component';

describe('CreditFinanceComponent', () => {
  let component: CreditFinanceComponent;
  let fixture: ComponentFixture<CreditFinanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditFinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
