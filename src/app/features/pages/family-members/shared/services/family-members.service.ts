import { Injectable, Injector } from '@angular/core';
import { FamilyMembers } from '../models/family-members.model';
import { BaseFormService } from 'src/app/shared/services/base/base-form.service';

@Injectable({
  providedIn: 'root'
})
export class FamilyMembersService extends BaseFormService<FamilyMembers>{

  constructor(injector: Injector) {
    super('parente', 'parente', injector) 
  }
}
