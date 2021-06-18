import { Component } from '@angular/core';
import { BackendService } from './services/backend.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  //Ist die App beendet worden?
  shutdown = false;

  //Service injecten
  constructor(private bs: BackendService, private titleService: Title) { }

  //beim Init
  ngOnInit() {

    //HTML-Page-Title setzen
    //TODO ueber server.js setzen
    this.titleService.setTitle("SH Audio");

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
    }, 2500);
  }
}