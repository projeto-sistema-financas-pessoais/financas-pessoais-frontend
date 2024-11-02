import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberTransationsComponent } from './family-member-transations.component';

describe('FamilyMemberTransationsComponent', () => {
  let component: FamilyMemberTransationsComponent;
  let fixture: ComponentFixture<FamilyMemberTransationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyMemberTransationsComponent]
    });
    fixture = TestBed.createComponent(FamilyMemberTransationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
