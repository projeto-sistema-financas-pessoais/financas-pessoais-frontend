import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyMembersComponent } from './family-members.component';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  { path: '', component: FamilyMembersComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyMembersRoutingModule { }
