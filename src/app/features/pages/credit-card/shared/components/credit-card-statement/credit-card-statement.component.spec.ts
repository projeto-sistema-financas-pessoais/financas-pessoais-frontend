import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardStatementComponent } from './credit-card-statement.component';

describe('CreditCardStatementComponent', () => {
  let component: CreditCardStatementComponent;
  let fixture: ComponentFixture<CreditCardStatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardStatementComponent]
    });
    fixture = TestBed.createComponent(CreditCardStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
