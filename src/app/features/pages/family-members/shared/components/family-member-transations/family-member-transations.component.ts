import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FamilyMembers } from '../../models/family-members.model';
import { FamilyMembersService } from '../../services/family-members.service';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';

@Component({
  selector: 'app-family-member-transations',
  templateUrl: './family-member-transations.component.html',
  styleUrls: ['./family-member-transations.component.scss']
})
export class FamilyMemberTransationsComponent extends BaseGetIdComponent<FamilyMembers>{


  constructor
  (  injector : Injector,
    private familyMembersService: FamilyMembersService){
    super(injector, new FamilyMembers({}), familyMembersService);
  }



}
