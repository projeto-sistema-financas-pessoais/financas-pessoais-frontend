import { Directive, HostListener, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appCurrencyInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputDirective),
      multi: true
    }
  ]
})
export class CurrencyInputDirective implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elRef: ElementRef) {}

  // Converte o valor do modelo para exibir no campo (com vírgulas)
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      const formattedValue = this.toDisplayFormat(value);
      this.updateInput(formattedValue);
    }
  }

  // Registra a função para salvar o valor no modelo (com pontos)
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra a função para marcar como "tocado"
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const sanitizedValue = value.replace(/[^0-9,]/g, '');

    const singleCommaValue = this.preventMultipleCommas(sanitizedValue);

    // Limita a duas casas decimais após a vírgula
    const limitedValue = this.limitDecimalPlaces(singleCommaValue);

    // Converte para o formato do modelo e atualiza
    const numericValue = this.toModelFormat(limitedValue); // Converte para ponto
    this.onChange(numericValue); // Atualiza o modelo
    this.updateInput(limitedValue); // Exibe o valor com vírgula no campo
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private toDisplayFormat(value: string): string {
    // console.log("value", value)
    return String(value).replace('.', ',');
  }

  private toModelFormat(value: string): string {
    return value.replace(',', '.');
  }

  private limitDecimalPlaces(value: string): string {
    const parts = value.split(',');
    if (parts.length === 2) {
      parts[1] = parts[1].substring(0, 2);
    }
    return parts.join(',');
  }

  private updateInput(value: string): void {
    const inputElement = this.elRef.nativeElement as HTMLInputElement;
    if (inputElement) {
      inputElement.value = value;
    }
  }

  private preventMultipleCommas(value: string): string {
    const parts = value.split(',');
    return parts.length > 1 ? parts[0] + ',' + parts.slice(1).join('').replace(/,/g, '') : value;
  }
}
