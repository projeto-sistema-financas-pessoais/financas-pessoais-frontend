import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstTwoWords'
})
export class FirstTwoWordsPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    const words = value.split(' ');
    return words.slice(0, 2).join(' ');
  }
}
