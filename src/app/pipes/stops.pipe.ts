import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stops'
})
export class StopsPipe implements PipeTransform {
  transform(stop: number): string {
    if (!stop) return 'Direct Flight'
    else return `${stop} Stop`
  }

}
