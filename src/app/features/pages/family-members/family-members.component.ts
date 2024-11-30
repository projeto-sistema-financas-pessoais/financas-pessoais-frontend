import { Component, Injector } from '@angular/core';
import { BaseFormComponent } from 'src/app/shared/components/base/base-form.component';
import { FamilyMembers } from './shared/models/family-members.model';
import { FamilyMembersService } from './shared/services/family-members.service';
import { Validators } from '@angular/forms';
import { AuthService } from '../../auth/shared/services/auth.service';

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss']
})
export class FamilyMembersComponent extends BaseFormComponent<FamilyMembers>{
 

  constructor(
    protected readonly familyMembersService: FamilyMembersService,
    injector : Injector,
    protected readonly authService: AuthService

     ){
    super(injector, new FamilyMembers({}), 'parente', 'Membros da Família', familyMembersService);
  }

  nameUser!: string;
  
  protected override buildForm(): void {
    this.resourceForm = this.formBuilder.group({
      nome: [null, [Validators.required]],
      email: [null, [Validators.email]],
      grau_parentesco: [null],
      ativo: [null],
    });
  }

  override ngOnInit(): void {
    this.images = this.imageListService.getImages();
    this.imageSelected = this.images[0].fileName;

    this.getAll(false);
    this.buildForm();
    this.nameUser = this.authService.GetUser().name || 'null'

  }

  protected override enableForm(enable: boolean): void {
  }

}
