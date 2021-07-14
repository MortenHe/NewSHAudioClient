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
    this.bs.getPageTitle().subscribe((pageTitle: string) => {
      if (pageTitle) {
        const title = pageTitle.length > 2 ? pageTitle[0].toUpperCase() + pageTitle.substring(1) : pageTitle.toUpperCase();
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