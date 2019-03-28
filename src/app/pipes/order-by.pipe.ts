import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  //Soriterung nach Name
  transform(items: any[]): any {

    //kein Sortierung moeglich, wenn keine Items da sind
    if (!items) {
      return [];
    }

    //Items soriteren, dazu immer 2 Elemente vergleichen
    items.sort((a, b) => {

      //normale Sortierung nach Namensfeld (nur aufsteigend moeglich)
      return a.fileName > b.fileName ? 1 : -1;
    });

    //sortiertes Array zurueckgeben
    return items;
  }
}