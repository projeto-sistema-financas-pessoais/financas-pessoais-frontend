import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'formatday'
  })
  export class FormatDayDate implements PipeTransform {
    transform(value: string | Date): number {
    
      const date = new Date(value);
      date.setUTCHours(0, 0, 0, 0);
      return date.getUTCDate();
    }
  }