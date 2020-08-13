import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { FileService } from 'src/app/services/file.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  jumpPosition: number = -1;

  //Titel, der gearde gehovert wird
  hoverTitle = null;

  constructor(private bs: BackendService, private fs: FileService) { }

  ngOnInit() {

    //files abonnieren
    this.bs.getFiles().subscribe(files => {
      this.files = files;

      //Jump Position zuruecksetzen, wenn neue Titelliste vorliegt
      this.jumpPosition = -1;
    });

    //insertIndex abonnieren
    this.bs.getInsertIndex().subscribe(insertIndex => {
      this.insertIndex = insertIndex;
    });

    //jumpPosition abonnieren
    this.fs.getJumpPosition().subscribe(jumpPosition => {
      this.jumpPosition = jumpPosition;
    });

    //hoverTitle abonnieren
    this.fs.getHoverTitle().subscribe(hoverTitle => {
      this.hoverTitle = hoverTitle;
    });
  }

  //zu gewissem Titel in Playlist springen
  jumpTo(position: number) {
    this.bs.sendMessage({ type: "jump-to", value: position });

    //Wenn zu einem anderen Titel als dem aktuellen gesprungen werden soll, bei diesem Eintrag einen Spinner anzeigen, bis der Titel geladen wurde
    if (position !== 0) {
      this.fs.setJumpPosition(position);
    }

    //nach oben scrollen
    window.scroll(0, 0);
  }

  //Wenn Sortiervorgang abgeschlossen ist -> Model anpassen und Server ueber neue Sortierung informieren
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.files, event.previousIndex + 1, event.currentIndex + 1);

    //Info an Server
    this.bs.sendMessage({
      type: "sort-playlist", value: {
        from: event.previousIndex + 1,
        to: event.currentIndex + 1
      }
    });
  }

  //Titel einreihen (gueltig fuer Bereich unterhalb der Einfuegemarke)
  enqueueSong(index) {
    if (index >= this.insertIndex) {
      this.bs.sendMessage({
        type: "enqueue-title",
        value: index
      });
    }

    //Hover Titel zuruecksetzen
    this.resetHoverTitle();
  }

  //Hover Titel setzen (gueltig fuer Bereich unterhalb der Einfuegemarke)
  setHoverTitle(index) {
    if (index >= this.insertIndex) {
      this.fs.setHoverTitle(this.files[index]);
    }
  }

  //Hover Titel zuruecksetzen
  resetHoverTitle() {
    this.fs.resetHoverTitle();
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