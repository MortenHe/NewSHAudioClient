import { Component } from '@angular/core';
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  //Ist die App beendet worden?
  shutdown = false;

  //Service injecten
  constructor(private bs: BackendService) { }

  //beim Init
  ngOnInit() {

    //shutdown Zustand abbonieren
    this.bs.getShutdown().subscribe(shutdown => {
      this.shutdown = shutdown;
    });

    //Regelmassieg eine Nachricht an WSS schicken, damit ggf. die Verbindung wieder aufgebaut wird
    setInterval(() => {
      this.bs.sendMessage({
        type: "ping",
        value: ""
      });
    }, 1500);
  }
}