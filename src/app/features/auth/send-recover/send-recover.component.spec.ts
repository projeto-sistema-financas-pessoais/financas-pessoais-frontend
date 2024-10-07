import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRecoverComponent } from './send-recover.component';

describe('SendRecoverComponent', () => {
  let component: SendRecoverComponent;
  let fixture: ComponentFixture<SendRecoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendRecoverComponent]
    });
    fixture = TestBed.createComponent(SendRecoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
