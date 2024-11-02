import { NgModule } from '@angular/core';
import { FamilyMembersComponent } from './family-members.component';
import { Routes, RouterModule } from '@angular/router';
import { FamilyMemberTransationsComponent } from './shared/components/family-member-transations/family-member-transations.component';



const routes: Routes = [
  { path: '', component: FamilyMembersComponent,
  },
  { path: 'movimentacoes-por-membro/:id', component: FamilyMemberTransationsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyMembersRoutingModule { }
