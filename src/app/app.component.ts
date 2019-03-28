import { Component } from '@angular/core';
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  //aktuell laufender Song
  currentSong = "";

  //Liste aller files
  files = [];

  //Position in Playlist
  position = 0;

  //temp. Wert, wohin gerade gesprungen werden soll
  jumpPosition: number = -1;

  //ist gerade pausiert?
  paused = false;

  //Start-Volume
  volume = 50;

  //clicks auf shutdown button zaehlen
  clicks = 0;

  //Ist die App beendet worden?
  shutdown$;

  //Service injecten
  constructor(private bs: BackendService) { }

  //beim Init
  ngOnInit() {

    //files abonnieren
    this.bs.getFiles().subscribe(files => {
      this.files = files;
    })

    //position abbonieren
    this.bs.getPosition().subscribe(position => {
      this.position = position;

      //temp. Sprungwert (fuer optische Darstellung) wieder zuruecksetzen nach kurzer Verzoegerung
      setTimeout(() => {
        this.jumpPosition = -1
      }, 500);
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
    this.shutdown$ = this.bs.getShutdown();

    //Regelmassieg eine Nachricht an WSS schicken, damit ggf. die Verbindung wieder aufgebaut wird
    setInterval(() => {
      this.bs.sendMessage({
        type: "ping",
        value: ""
      });
    }, 1500);
  }

  //aktuellen Song ermitteln
  getCurrentSong() {
    return this.files[this.position];
  }

  //gewissen Song abspielen
  playSong(index) {
    this.bs.sendMessage({ type: "jump-to", value: index });
  }

  //Song einreihen
  enqeueSong(index) {

    //Aktuellen Titel kann man nicht einreihen
    if (index !== this.position) {

      //Playlist und aktuelle Position holen
      let tempFiles = this.files;
      let tempPosition = this.position

      //Wenn der Titel der angehaengt werden soll vor dem aktuellen Titel liegt, muss der Titel an anderer Stelle eingereiht werden
      if (index < this.position) {
        tempPosition -= 1;
      }

      //Titel in Playlist verschieben (hinter aktuellen Titel) und Info der neuen Playlist und Position an WSS schicken
      tempFiles.splice(tempPosition + 1, 0, tempFiles.splice(index, 1)[0]);
      this.bs.sendMessage({ type: "set-files", value: { files: tempFiles, position: tempPosition } });
    }
  }

  //zu gewissem Titel in Playlist springen
  jumpTo(position: number) {

    //Befehl an WSS schicken
    this.bs.sendMessage({ type: "jump-to", value: position });

    //Wenn zu einem anderen Titel gesprungen werden soll, bei diesem Eintrag einen Spinner anzeigen, bis der Titel geladen wurde
    if (this.position !== position) {
      this.jumpPosition = position;
    }
  }

  //vor oder zureuck schalten
  changeItem(increase) {
    this.bs.sendMessage({ type: "change-item", value: increase });
  }

  //paused toggeln
  togglePaused() {
    this.bs.sendMessage({ type: "toggle-paused", value: "" });
  }

  //volume aendern
  changeVolume(increase) {
    this.bs.sendMessage({ type: "change-volume", value: increase });
  }

  //Pi per Service herunterfahren
  shutdownPi() {

    //Clicks erhoehen
    this.clicks++;

    //Wenn der Nutzer innerhalb einer gewissen Zeit 2 mal geklickt hat
    if (this.clicks === 2) {

      //Pi herunterfahren
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