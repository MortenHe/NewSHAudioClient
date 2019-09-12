import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'pi-controls',
  templateUrl: './pi-controls.component.html',
  styleUrls: ['./pi-controls.component.scss']
})
export class PiControlsComponent implements OnInit {

  //clicks auf shutdown Button zaehlen
  clicks = 0;

  //Zustand ob Verbindung zu WSS existiert
  connected: boolean;

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //Zustand abbonieren, ob Verbindung zu WSS besteht
    this.bs.getConnected().subscribe(connected => {
      this.connected = connected
    });
  }

  //WSS-Server per PHP Aufruf starten
  activateApp() {
    this.bs.activateApp().subscribe();
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
