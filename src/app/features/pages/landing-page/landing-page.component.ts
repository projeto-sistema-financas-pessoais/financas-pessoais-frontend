import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  name_user!: string;

  constructor(
    protected authService: AuthService,
  ){}

  ngOnInit(): void {
    this.name_user = this.authService.GetUser() || 'null'
  }

}
