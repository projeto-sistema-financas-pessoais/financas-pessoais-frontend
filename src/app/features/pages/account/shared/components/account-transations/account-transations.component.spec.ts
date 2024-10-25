import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransationsComponent } from './account-transations.component';

describe('AccountTransationsComponent', () => {
  let component: AccountTransationsComponent;
  let fixture: ComponentFixture<AccountTransationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountTransationsComponent]
    });
    fixture = TestBed.createComponent(AccountTransationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
