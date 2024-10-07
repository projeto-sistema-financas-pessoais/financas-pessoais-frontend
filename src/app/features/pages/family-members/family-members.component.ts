import { Component, Injector } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { FamilyMembers } from './shared/models/family-members.model';
import { FamilyMembersService } from './shared/services/family-members.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss']
})
export class FamilyMembersComponent extends BaseFormComponent<FamilyMembers>{

  constructor(
    protected readonly familyMembersService: FamilyMembersService,
    injector : Injector,

     ){
    super(injector, new FamilyMembers({}), 'parente', 'Membros da Família', familyMembersService);
  }
  
  protected override buildForm(): void {
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required]],
      grau_parentesco: [null],
      ativo: [null],
    });
  }
}
