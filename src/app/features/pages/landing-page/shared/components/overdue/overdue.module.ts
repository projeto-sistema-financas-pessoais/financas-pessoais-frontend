import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverdueComponent } from './overdue.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    TooltipModule.forRoot(),
    SharedModule,
    RouterModule
    
  ],
  declarations: [OverdueComponent],
  exports: [OverdueComponent]
})
export class OverdueModule { }
