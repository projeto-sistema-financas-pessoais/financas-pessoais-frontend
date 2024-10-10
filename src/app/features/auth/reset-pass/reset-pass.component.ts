import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {
  resourceForm!: FormGroup;
  token: string | null = null;


  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly alertModalService: AlertModalService
  ) {}

  ngOnInit(): void {
    this.buildResourceForm();
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      novaSenha: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required]]
    });
  }

  submitForm() {
    if (this.resourceForm.valid && this.resourceForm.get('novaSenha')?.value === this.resourceForm.get('confirmPassword')?.value) {
      const resource = {
        password: this.resourceForm.get('novaSenha')?.value
      };
      this.authService.resetPassword(this.token!, resource).subscribe({
        next: (response) => {
          this.alertModalService.showAlertSuccess("Senha atualizada com sucesso!");
        },
        error: (error) => {
          console.log("Erro ao atualizar a senha:", error);
          this.alertModalService.showAlertDanger("Erro ao atualizar a senha.");
        }
      });
    } else {
      this.alertModalService.showAlertDanger("As senhas não coincidem ou o formulário é inválido.");
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}

