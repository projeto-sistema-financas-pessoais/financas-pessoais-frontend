import { NgModule } from '@angular/core';
import { FamilyMembersComponent } from './family-members.component';
import { FamilyMembersRoutingModule } from './family-members-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FamilyMemberTransationsComponent } from './shared/components/family-member-transations/family-member-transations.component';


@NgModule({
  declarations: [
    FamilyMembersComponent,
    FamilyMemberTransationsComponent
  ],
  imports: [
    SharedModule,
    FamilyMembersRoutingModule,
    ReactiveFormsModule
  ]
})
export class FamilyMembersModule { }
