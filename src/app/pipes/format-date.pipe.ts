import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    value = value.replace('T', ' | ')
    return value.slice(0, value.length - 3)
  }

}
