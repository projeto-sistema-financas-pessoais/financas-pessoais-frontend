import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/services/auth.service';

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

  constructor(
    protected authService: AuthService,
  ){}

  ngOnInit(): void {
    this.nameUser = this.authService.GetUser().name || 'null'
    let date =  new Date();
    this.dateMonthYear =  `${(date.getMonth() +1)}-${date.getFullYear()}`

  }

}
