import { Component } from '@angular/core';
import { BackendService } from './services/backend.service';
import { FormControl } from '@angular/forms';
import { FilterListPipe } from './pipes/filter-list.pipe';
import { FileNamePipe } from './pipes/file-name.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  //AudioModes laden aus config
  modes = environment.modes;

  //Audiomodus (sh, mh, kids)
  audioMode = "";

  //Liste aller files
  files = [];

  //Liste der files gefiltert nach Suchanfrage
  filteredFiles = [];

  //Wo soll der naechste Track eingefuegt werden. Wert waechst bis neuer Titel kommt
  insertIndex = 1;

  //temp. Wert, wohin gerade gesprungen werden soll
  jumpPosition = -1;

  //ist gerade pausiert?
  paused = false;

  //Start-Volume
  volume = 50;

  //clicks auf shutdown button zaehlen
  clicks = 0;

  //Ist die App beendet worden?
  shutdown = false;

  //Zustand ob Verbindung zu WSS existiert
  connected: boolean;

  //Suchfeld fuer Titelliste
  titleSearch: FormControl = new FormControl("");

  //Suchterm
  term: string = "";

  //Pipes in Comp. aufrufen
  filterListPipe = new FilterListPipe();
  fileNamePipe = new FileNamePipe();

  //Titel, der gearde gehovert wird
  hoverTitle = "";

  //Service injecten
  constructor(private bs: BackendService) { }

  //beim Init
  ngOnInit() {

    //audioMode abonnieren
    this.bs.getAudioMode().subscribe(audioMode => {
      this.audioMode = audioMode;
    });

    //files abonnieren
    this.bs.getFiles().subscribe(files => {
      this.files = files;

      //???
      this.filterFiles();

      //Jump Position zuruecksetzen, wenn neue Titelliste vorliegt
      this.jumpPosition = -1
    });

    //insertIndex abbonieren
    this.bs.getInsertIndex().subscribe(insertIndex => {
      this.insertIndex = insertIndex;
    });

    //paused abbonieren
    this.bs.getPaused().subscribe(paused => {
      this.paused = paused;
    });

    //volume abbonieren
    this.bs.getVolume().subscribe(volume => {
      this.volume = volume;
    });

    //shutdown Zustand abbonieren
    this.bs.getShutdown().subscribe(shutdown => {
      this.shutdown = shutdown;
    });

    //Zustand abbonieren, ob Verbindung zu WSS besteht
    this.bs.getConnected().subscribe(connected => {
      this.connected = connected
    });

    //Wenn im Suchfeld gesucht wird
    this.titleSearch.valueChanges.subscribe(val => {

      //Suchanfrage trimmen und merken
      this.term = val.trim();

      //Dateiliste filtern anhand des Suchterms
      this.filterFiles();
    });

    //Regelmassieg eine Nachricht an WSS schicken, damit ggf. die Verbindung wieder aufgebaut wird
    setInterval(() => {
      this.bs.sendMessage({
        type: "ping",
        value: ""
      });
    }, 1500);
  }

  //Audiomodus setzen (sh, mh, kids)
  setAudioMode(mode) {
    this.bs.sendMessage({
      type: "set-audio-mode",
      value: mode
    });
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

  //Aus Trefferliste der Suche einen Titel einreihen und Suchfeld danach leeren
  enqueueSongFromSearch(index) {
    this.enqueueSong(index);
    this.titleSearch.setValue("");
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
    this.resetHoverTitle();
  }

  //Aus Trefferliste der Suche zu einem Titel springen und Suchfeld danach leeren
  jumpToFromSearch(position: number) {
    this.jumpTo(position);
    this.titleSearch.setValue("");
  }

  //Wenn Sortiervorgang abgeschlossen ist, Server ueber neue Sortierung informieren
  sortDone(event: any) {
    this.bs.sendMessage({
      type: "sort-playlist", value: {
        from: event.oldIndex,
        to: event.newIndex
      }
    });
  };

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

  //vor oder zureuck schalten
  changeItem(step) {
    this.bs.sendMessage({ type: "change-item", value: step });
  }

  //paused toggeln
  togglePaused() {
    this.bs.sendMessage({ type: "toggle-paused", value: "" });
  }

  //volume aendern
  changeVolume(increase) {
    this.bs.sendMessage({ type: "change-volume", value: increase });
  }

  //WSS-Server per PHP Aufruf starten
  activateApp() {
    this.bs.activateApp().subscribe();
  }

  //Titelliste filtern anhand des Suchterms
  filterFiles() {

    //gefilterte Titelliste zuruecksetzen
    this.filteredFiles = [];

    //Wenn mind. 2 Buchstaben eingegeben wurden
    if (this.term.length >= 2) {

      //Titelliste anhand des Terms filtern
      let tempFilteredFiles = this.filterListPipe.transform(this.files, this.term);

      //Ueber gefiltertete Titelliste gehen
      for (let file of tempFilteredFiles) {

        //Namensform anpassen (Pfad und Dateiendung weg)
        let tempFileName = this.fileNamePipe.transform(file.fileName);

        //Titel (ausser dem aktuell laufemden) in Liste der gefilterteten Titel einfuegen
        if (file.index !== 0) {
          this.filteredFiles.push({
            fileName: tempFileName,
            index: file.index
          });
        }
      }
    }
  }

  trackByFn(index, node) {
    return node;
  }

  //HoverTitle setzen fuer Oberflaeche (welcher Song wird eingefuegt)
  //nur fuer Bereich hinter Einfuegemarke. Oberhalb davor wir per drag & drop sortiert
  setHoverTitle(index) {
    if (index >= this.insertIndex) {
      this.hoverTitle = this.files[index];
    }
  }

  //HoverTitle zuruecksetzen
  resetHoverTitle() {
    this.hoverTitle = "";
  }

  //Pi per Service herunterfahren
  shutdownPi() {

    //Clicks erhoehen. Wenn der Nutzer innerhalb einer gewissen Zeit 2 mal geklickt hat, Pi herunterfahren
    this.clicks++;
    if (this.clicks === 2) {
      this.bs.sendMessage({ type: "shutdown", value: "" });
    }

    //Timeout erstellen, damit clicks wieder zurueckgesetzt wird
    else {
      setTimeout(() => {
        this.clicks = 0;
      }, 2000);
    }
  }
}