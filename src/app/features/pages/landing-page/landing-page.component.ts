import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {


  nameUser!: string;
  dateMonthYear: string = ''
  monthly : boolean = true
  economy: boolean = true
  expense : boolean = true
  income : boolean = true

  menuGeneral: boolean = true;

  constructor(
    protected authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location
  ){}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      if (params['value']) {
        this.menuGeneral = params['value'] === "Geral";
      }
    });
    this.nameUser = this.authService.GetUser().name || 'null'
    let date =  new Date();
    this.dateMonthYear =  `${(date.getMonth() +1)}-${date.getFullYear()}`

  }
  changeMenu(geral: boolean){
    this.menuGeneral = geral


    let queryParams: any = {value: this.menuGeneral ? 'Geral': 'Despesa'};
    const url = this.router.createUrlTree(['/inicio'], { queryParams }).toString();
    this.location.go(url)
    this.location.replaceState(url)
  }



  onKeyDownMenu(event: KeyboardEvent, model: boolean){
    if (event.key === 'Enter' || event.key === ' ') {
      this.changeMenu(model); 
      event.preventDefault(); 
    }

  }
}
