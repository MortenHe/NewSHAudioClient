import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayShift'
})
export class ArrayShiftPipe implements PipeTransform {

  transform(files: any[], splitPosition: number): any {

    //Array Startpunkt aendern. splitPosition ist die neue Startposition des Arrays.
    //Vorherige Elemente hinten anhaengen
    //[1, 2, 3, 4, 5] mit splitPosition = 3 -> [4, 5, 1, 2, 3]
    return (files.slice(splitPosition)).concat(files.slice(0, splitPosition));
  }

}
