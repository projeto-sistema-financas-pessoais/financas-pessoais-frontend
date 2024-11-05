import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  nameUser!: string;

  constructor(
    protected authService: AuthService,
  ){}

  ngOnInit(): void {
    this.nameUser = this.authService.GetUser().name || 'null'
  }

}
