import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  //Zustand ob Verbindung zu WSS existiert
  connected: boolean;

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //Zustand abbonieren, ob Verbindung zu WSS besteht
    this.bs.getConnected().subscribe(connected => {
      this.connected = connected;
    });
  }

  //WSS-Server per PHP Aufruf starten
  activateApp() {
    this.bs.activateApp().subscribe();
  }
}