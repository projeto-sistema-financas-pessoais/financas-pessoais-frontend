import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'formatday'
  })
  export class FormatDayDate implements PipeTransform {
    transform(value: string | Date): string {
      const date = new Date(value);
      date.setUTCHours(0, 0, 0, 0);
  
      const day = date.getUTCDate();
      const month = date.getUTCMonth() +1
      return day.toString().padStart(2, '0') + '/' + month ;
    }
  }