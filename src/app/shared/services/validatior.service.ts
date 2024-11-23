import { ValidatorFn, AbstractControl, FormArray } from "@angular/forms";

export function divideParentValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const valueTotal = formGroup.get('valor')?.value;
  
      const divideParenteArray = formGroup.get('divide_parente') as FormArray;
  
      if ( !divideParenteArray || divideParenteArray.length == 0) {
        return null;
      }
  
      const ids = divideParenteArray.controls.map(control => String(control.get('id_parente')?.value));
      const idsDuplicados = ids.some((id, index) => ids.indexOf(id) !== index);
  
  
      if (idsDuplicados) {
        return { duplicateId: true };
      }
  
      if(!valueTotal){
        return null
      }
  
      const somaValores = divideParenteArray.controls
        .map(control => Number(control.get('valor_parente')?.value) || 0)
        .reduce((acc, curr) => acc + curr, 0);
  
        const somaArredondada = Math.round(somaValores * 100) / 100;
        const valorTotalArredondado = Math.round(valueTotal * 100) / 100;
  
        return somaArredondada === valorTotalArredondado ? null : { invalidSum: true };
      };
  }