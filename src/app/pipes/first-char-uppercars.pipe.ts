import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCharUppercars'
})
export class FirstCharUppercarsPipe implements PipeTransform {

  transform(value: string, ): string {
    const firstCharUppercars=value.charAt(0).toUpperCase();
    const subStr=value.substring(1);
    return firstCharUppercars + subStr;
  }

}
