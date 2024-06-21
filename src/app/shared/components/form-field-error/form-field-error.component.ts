import { Component, Input } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
    selector: 'app-form-field-error',
    template: `
      <p class="text-danger">
      {{errorMessage}}
      </p>
    `,
  })
  export class FormFieldErrorComponent {
  
    @Input() control: AbstractControl | FormControl | null | undefined;
  
  
    get errorMessage(){
      if(this.mustShowErrorMessage())
        return this.getErrorMessage();
      else
        return null;
    }
  
    private mustShowErrorMessage(){
      return this.control?.invalid && this.control.touched
    }
  
    private getErrorMessage(){
      if(this.control?.errors?.['required'])
        return "Campo obrigatório";
      else if(this.control?.errors?.['email'])
        return "Formato de email inválido";
      else if (this.control?.errors?.['minlength']){
        const requiredLenght = this.control.errors?.['minlength'].requiredLength;
        return `Deve ter no mínimo ${requiredLenght} caracteres`
      }
      else if (this.control?.errors?.['maxlength']){
        const requiredLenght = this.control.errors?.['maxlength'].requiredLength;
        return `deve ter no máximo ${requiredLenght} caracteres`
      }else if(this.control?.errors?.['min']){
        const requiredLenght = this.control.errors?.['min'].min;
        return `Deve ter no mínimo ${requiredLenght} caracteres`
      }else if(this.control?.errors?.['formatInvalid']){
        return 'Formato de data inválida';
      }else if(this.control?.errors?.['dateInvalid']){
        return 'Data inválida';
      }
      else
        return null;
    }


    
  }
  