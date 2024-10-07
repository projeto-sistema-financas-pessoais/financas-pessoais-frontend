import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent {

  token: any;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertModalService: AlertModalService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
    })
  }

}
