import { Component } from '@angular/core';
import { BackendService } from './services/backend.service';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  //App-Name aus Config holen
  envName = environment.envName;

  //Ist die App beendet worden?
  shutdown = false;

  //Service injecten
  constructor(private bs: BackendService, private titleService: Title) { }

  //beim Init
  ngOnInit() {

    //HTML-Page-Title setzen
    this.titleService.setTitle(this.envName);

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