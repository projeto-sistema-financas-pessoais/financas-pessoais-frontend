import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyMembersComponent } from './family-members.component';
import { FamilyMembersRoutingModule } from './family-members-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FamilyMembersComponent
  ],
  imports: [
    SharedModule,
    FamilyMembersRoutingModule,
    ReactiveFormsModule
  ]
})
export class FamilyMembersModule { }
