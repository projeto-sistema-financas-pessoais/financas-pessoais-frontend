import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {
  transform(value: string | number | undefined): string {
      if (value === undefined || value == null) {
          return ''; 
      }

      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      return numericValue.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
}


@Pipe({
  name: 'formatPriceInt'
})
export class FormatPricePipeInt implements PipeTransform {
  transform(value: string | number | undefined ): string {
      if (value === undefined || value == null) {
          return '0'; 
      }

      let numericValue = typeof value === 'string' ? parseFloat(value) : value;

      if (numericValue > 0 && numericValue < 1) {
          numericValue = 1;
      }
      const result = numericValue.toLocaleString('pt-BR', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
      return result
  }
}
