import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMembersComponent } from './family-members.component';

describe('FamilyMembersComponent', () => {
  let component: FamilyMembersComponent;
  let fixture: ComponentFixture<FamilyMembersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyMembersComponent]
    });
    fixture = TestBed.createComponent(FamilyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
