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

    //HTML-Page-Title setzen, kurze Namen Caps-Locked (mh -> MH), lange Titel nur 1. Buchstabe gross (luis -> Luis)
    this.bs.getUserMode().subscribe((userMode: string) => {
      console.log(userMode)
      if (userMode) {
        const title = userMode.length > 2 ? userMode[0].toUpperCase() + userMode.substring(1) : userMode.toUpperCase();
        this.titleService.setTitle(title);
      }
    });

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