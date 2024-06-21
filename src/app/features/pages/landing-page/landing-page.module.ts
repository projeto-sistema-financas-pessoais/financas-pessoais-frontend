import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingPageRoutingModule } from './landing-page-routing.module';



@NgModule({
  declarations: [
    LandingPageComponent,
  ],
  imports: [
    SharedModule,
    LandingPageRoutingModule
  ]
})
export class LandingPageModule { }
