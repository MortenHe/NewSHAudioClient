import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss']
})
export class PlayListComponent implements OnInit {

  //Liste aller files
  files = [];

  //Wo soll der naechste Track eingefuegt werden. Wert waechst bis neuer Titel kommt
  insertIndex = 1;

  //temp. Wert, wohin gerade gesprungen werden soll
  jumpPosition = -1;

  //Titel, der gearde gehovert wird
  hoverTitle = "";

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //files abonnieren
    this.bs.getFiles().subscribe(files => {
      this.files = files;

      //Jump Position zuruecksetzen, wenn neue Titelliste vorliegt
      this.jumpPosition = -1
    });

    //insertIndex abbonieren
    this.bs.getInsertIndex().subscribe(insertIndex => {
      this.insertIndex = insertIndex;
    });
  }

  //Wenn Sortiervorgang abgeschlossen ist, Server ueber neue Sortierung informieren
  sortDone(event: any) {
    this.bs.sendMessage({
      type: "sort-playlist", value: {
        from: event.oldIndex,
        to: event.newIndex
      }
    });
  }

  //zu gewissem Titel in Playlist springen
  jumpTo(position: number) {
    this.bs.sendMessage({ type: "jump-to", value: position });

    //Wenn zu einem anderen Titel als dem aktuellen gesprungen werden soll, bei diesem Eintrag einen Spinner anzeigen, bis der Titel geladen wurde
    if (position !== 0) {
      this.jumpPosition = position;
    }

    //nach oben scrollen
    window.scroll(0, 0);
  }

  //Titel einreihen
  enqueueSong(index) {

    //Titel an passender Stelle einreihen, aber aktuellen Titel kann man nicht einreihen
    if (index !== 0) {
      this.bs.sendMessage({
        type: "enqueue-title",
        value: index
      });
    }

    //Hover Titel wieder zuruecksetzen
    //this.resetHoverTitle();
  }

  //Titel ans Ende der Playlist verschieben (nicht bei aktuellem Titel moeglich)
  moveTitleToEnd(index) {
    if (index !== 0) {
      this.bs.sendMessage({
        type: "move-title-to-end",
        value: index
      });
    }
  }
}