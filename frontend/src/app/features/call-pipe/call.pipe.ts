import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'call',
})
export class CallPipe implements PipeTransform {
  transform(callback: (...params: any[]) => void, ...params: any[]): any {
    return callback(...params);
  }
}
