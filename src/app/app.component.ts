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

  //ist gerade pausiert?
  paused = false;

  //ist gerade random?
  random = false;

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
    });

    //paused abbonieren
    this.bs.getPaused().subscribe(paused => {
      this.paused = paused;
    });

    //random abbonieren
    this.bs.getRandom().subscribe(random => {
      this.random = random;
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

  //vor oder zureuck schalten
  changeItem(increase) {
    this.bs.sendMessage({ type: "change-item", value: increase });
  }

  //paused toggeln
  togglePaused() {
    this.bs.sendMessage({ type: "toggle-paused", value: "" });
  }

  //random toggeln
  toggleRandom() {
    this.bs.sendMessage({ type: "toggle-random", value: "" });
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