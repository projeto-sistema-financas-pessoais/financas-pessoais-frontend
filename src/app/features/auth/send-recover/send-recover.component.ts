import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-send-recover',
  templateUrl: './send-recover.component.html',
  styleUrls: ['./send-recover.component.scss']
})
export class SendRecoverComponent {
  resourceForm!: FormGroup;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertModalService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.buildResourceForm();
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submitForm() {
    const email = this.resourceForm.value.email;
    this.authService.sendRecoveryEmail({ email })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.alertService.showAlertSuccess("Email de recuperação enviado com sucesso!");
        },
        error: (error) => {
          console.error("Error sending recovery email", error);
          this.alertService.showAlertDanger("Falha ao enviar o email de recuperação. Verifique o email inserido.");
        }
      });
  }
}
